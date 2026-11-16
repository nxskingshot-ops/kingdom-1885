package app.nexusphalanx.stage.homefinal;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;

import androidx.activity.result.ActivityResult;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.ActivityCallback;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.io.IOException;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;

@CapacitorPlugin(name = "OutpostExport")
public class OutpostExportPlugin extends Plugin {
    @PluginMethod
    public void save(PluginCall call) {
        String format = call.getString("format", "");
        String content = call.getString("content");
        if ((!format.equals("json") && !format.equals("csv"))
            || content == null || content.isEmpty() || content.length() > 512_000) {
            call.reject("Invalid Outpost export");
            return;
        }

        Intent intent = new Intent(Intent.ACTION_CREATE_DOCUMENT);
        intent.addCategory(Intent.CATEGORY_OPENABLE);
        intent.setType(format.equals("json") ? "application/json" : "text/csv");
        intent.putExtra(Intent.EXTRA_TITLE, "PHALANX-Outposts-1885." + format);
        startActivityForResult(call, intent, "saveDocument");
    }

    @ActivityCallback
    private void saveDocument(PluginCall call, ActivityResult result) {
        if (call == null) return;
        if (result.getResultCode() != Activity.RESULT_OK) {
            call.resolve(new JSObject().put("saved", false));
            return;
        }

        Intent picked = result.getData();
        Uri destination = picked == null ? null : picked.getData();
        if (destination == null) {
            call.reject("Missing export destination");
            return;
        }
        try (OutputStream stream = getContext().getContentResolver().openOutputStream(destination, "wt")) {
            if (stream == null) throw new IOException("Could not open export destination");
            stream.write(call.getString("content", "").getBytes(StandardCharsets.UTF_8));
        } catch (IOException | SecurityException error) {
            call.reject("Could not write Outpost export", error);
            return;
        }
        call.resolve(new JSObject().put("saved", true));
    }
}
