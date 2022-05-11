package com.example.newsapplication;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.annotation.RequiresApi;
import androidx.appcompat.app.ActionBarDrawerToggle;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.core.view.GravityCompat;
import androidx.drawerlayout.widget.DrawerLayout;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.Dialog;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.graphics.Point;
import android.graphics.Rect;
import android.os.Build;
import android.os.Bundle;
import android.speech.RecognizerIntent;
import android.speech.tts.TextToSpeech;
import android.util.Log;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import com.example.newsapplication.Model.Articles;
import com.example.newsapplication.Model.Headlines;
import com.example.newsapplication.Model.Source;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.gms.tasks.Task;
import com.google.android.material.navigation.NavigationView;
import com.google.mlkit.vision.common.InputImage;
import com.google.mlkit.vision.text.Text;
import com.google.mlkit.vision.text.TextRecognition;
import com.google.mlkit.vision.text.TextRecognizer;
import com.google.mlkit.vision.text.latin.TextRecognizerOptions;

import java.io.ByteArrayOutputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class MainActivity extends AppCompatActivity implements NavigationView.OnNavigationItemSelectedListener {
    private static final int CAMERA_REQUEST = 1888;
    //    private ImageView imageView;
    private static final int MY_CAMERA_PERMISSION_CODE = 100;

    RecyclerView recyclerView;
    SwipeRefreshLayout swipeRefreshLayout;
    Button  btnAboutUs;
    Dialog dialog;
    final String API_KEY = "a283830f953a4abda0897c4178511055";
    Adapter adapter;
    List<Articles>  articles = new ArrayList<>();
    List<Source>  sources = new ArrayList<>();
    Button speaker;
    Button mic;
     TextToSpeech mTTS;
     boolean speakerOn = false;

    //For Navigation Bar
    DrawerLayout drawerLayout;
    Toolbar toolbar;
    NavigationView navigationView;
    ActionBarDrawerToggle toggle;
    String speechToText="";

    String query = "headlines";


    @SuppressLint({"RestrictedApi", "WrongViewCast"})
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        //New appl code
        swipeRefreshLayout = findViewById(R.id.swipeRefresh);
        recyclerView = findViewById(R.id.recyclerView);

//        etQuery = findViewById(R.id.etQuery);
//        btnSearch = findViewById(R.id.btnSearch);
//        btnAboutUs = findViewById(R.id.aboutUs);
        dialog = new Dialog(MainActivity.this);

        speaker = findViewById(R.id.speaker);
        mic = findViewById(R.id.mic);

        recyclerView.setLayoutManager(new LinearLayoutManager(this));
        final String country = getCountry();


        swipeRefreshLayout.setOnRefreshListener(new SwipeRefreshLayout.OnRefreshListener() {
            @Override
            public void onRefresh() {
                Log.d("query", "onRefresh() returned: " + query );
               switch (query) {
                   case "headlines":
                       retrieveJson("", country, API_KEY, false);
                       break;
                   case "health":
                       retrieveJson("health",country,API_KEY, false);
                       break;

                   case "technology":
                       retrieveJson("technology",country,API_KEY, false);
                       break;

                   case "science":
                       retrieveJson("science",country,API_KEY, false);
                       break;

                   case "business":
                       retrieveJson("business",country,API_KEY, false);
                       break;

                   case "entertainment":
                       retrieveJson("entertainment",country,API_KEY, false);
                       break;

                   case "sports":
                       retrieveJson("sports",country,API_KEY, false);
                       break;
                   default:
//                       retrieveJson("", country, API_KEY, false);
                       break;


               }

//                if (query == "headlines")
//                {
//                    retrieveJson("",country,API_KEY, false);
//                }
//               else if (query == "headlines")
//                {
//                    retrieveJson("",country,API_KEY, false);
//                }

            }
        });
        retrieveJson("",country,API_KEY, false);

//        btnAboutUs.setOnClickListener(new View.OnClickListener() {
//            @Override
//            public void onClick(View v) {
//                showDialog();
//            }
//        });



        mTTS = new TextToSpeech(this, new TextToSpeech.OnInitListener() {
            @Override
            public void onInit(int status) {
                if (status == TextToSpeech.SUCCESS) {
                    int result = mTTS.setLanguage(Locale.US);

                    if (result == TextToSpeech.LANG_MISSING_DATA
                            || result == TextToSpeech.LANG_NOT_SUPPORTED) {
                        Log.e("TTS", "Language not supported");
                    } else {
                        speaker.setEnabled(true);
                    }
                } else {
                    Log.e("TTS", "Initialization failed");
                }
            }
        });

        speaker.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
               // code to get headlines and read all of them
                if( speakerOn == true){
                    speakerOn = false;
                    mTTS.stop();
                }else{
                    speakerOn = true;

                    if(adapter.viewType==2){

                        for(int i=0;i<sources.size();i++){

                            mTTS.speak(sources.get(i).getDescription(), TextToSpeech.QUEUE_ADD, null);
                        }
                    }else{
                        for(int i=0;i<articles.size();i++){

                            mTTS.speak(articles.get(i).getTitle(), TextToSpeech.QUEUE_ADD, null);
                        }
                    }

                }

            }
        });



        //For Navigration Drawer
        drawerLayout = findViewById(R.id.drawer);
        toolbar = findViewById(R.id.toolbar);
        navigationView = findViewById(R.id.navigationView);
        setSupportActionBar(toolbar);
        getSupportActionBar().setDefaultDisplayHomeAsUpEnabled(true);
        getSupportActionBar().setDisplayShowTitleEnabled(false);
        getSupportActionBar().setDisplayShowTitleEnabled(false);
        toggle = new ActionBarDrawerToggle(this,drawerLayout,toolbar,R.string.drawerOpen,R.string.drawerClose);
        drawerLayout.addDrawerListener(toggle);
        toggle.syncState();
        navigationView.setNavigationItemSelectedListener(this);

    }

    public void getSpeechInput(View view) {

        Intent intent = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
        intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
        intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE, Locale.getDefault());

        if (intent.resolveActivity(getPackageManager()) != null) {
            startActivityForResult(intent, 10);
        } else {
            Toast.makeText(this, "Your Device Don't Support Speech Input", Toast.LENGTH_SHORT).show();
        }


    }



    public void retrieveJson(String query ,String country, String apiKey, boolean flag ){

        Call<Headlines> call;
        swipeRefreshLayout.setRefreshing(true);

//        if (query == "")
//        {
////            call = ApiClient.getInstance().getApi().getHeadlines(query, country, apiKey);
//            Log.d("articles", "onResponse() returned: headlines " + call);
//        }
//        else {
            if (flag == false)
            {
                if (query == "")
                {
                    call = ApiClient.getInstance().getApi().getCategoryData(country, apiKey);
                }
                else
                {
                    call = ApiClient.getInstance().getApi().getHeadlines(query, country, apiKey);
                }

//                call = ApiClient.getInstance().getApi().getCategoryData(query, apiKey);
                Log.d("articles", "onResponse() returned: category data " + call);
            }
            else
            {
                // for ocr text
                call = ApiClient.getInstance().getApi().getSpecificData(query,apiKey);
            }

//        }

        call.enqueue(new Callback<Headlines>() {
            @Override
            public void onResponse(Call<Headlines> call, Response<Headlines> response) {
                Log.d("headlines", "onResponse() returned: " + response);
                Log.d("headlines", "onResponse() returned: " + response.body().getSources());
                if (response.isSuccessful() && response.body().getArticles() != null){
                    swipeRefreshLayout.setRefreshing(false);
                    articles.clear();
                    articles = response.body().getArticles();
                    Log.d("articles", "onResponse() returned: " + articles);
                    adapter = new Adapter(MainActivity.this,articles,sources);
                    adapter.setItemViewType(1);
                    recyclerView.setAdapter(adapter);
                }
                        

                if (response.isSuccessful() && response.body().getSources() != null){
                    swipeRefreshLayout.setRefreshing(false);
                    sources.clear();
                    sources = response.body().getSources();
                    Log.d("sources", "onResponse() returned: " + sources);
                    articles.removeAll(articles);
                    adapter = new Adapter(MainActivity.this , articles,sources);
                    adapter.setItemViewType(2);
                    recyclerView.setAdapter(adapter);
                }
            }

            @Override
            public void onFailure(Call<Headlines> call, Throwable t) {
                Log.d("articles", "onResponse() returned: failed call ");
                swipeRefreshLayout.setRefreshing(false);
                Toast.makeText(MainActivity.this, t.getLocalizedMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }

    public String getCountry(){
        Locale locale = Locale.getDefault();
        String country = locale.getCountry();
        return country.toLowerCase();
    }

    public void showDialog(){
        Button btnClose;
        dialog.setContentView(R.layout.about_us_pop_up);
        dialog.show();
    }


    @Override
    public boolean onNavigationItemSelected(@NonNull MenuItem menuItem) {
        final String country = getCountry();
        switch (menuItem.getItemId()){
            case R.id.headlines:
                this.query = "headlines";
                retrieveJson("",country,API_KEY, false);
            case R.id.sports:
                this.query = "sports";
                retrieveJson("sports",country,API_KEY, false);
//                Toast.makeText(MainActivity.this, "Profile Selected", Toast.LENGTH_SHORT).show();
                break;
            case R.id.technology:
                this.query = "technology";
                retrieveJson("technology",country,API_KEY, false);
//                Toast.makeText(MainActivity.this, "Contact us Selected", Toast.LENGTH_SHORT).show();
                break;
            case R.id.science:
                this.query = "science";
                retrieveJson("science",country,API_KEY, false);
//                Toast.makeText(MainActivity.this, "About us Selected", Toast.LENGTH_SHORT).show();
                break;
            case R.id.health:
                this.query = "health";
                retrieveJson("health",country,API_KEY,false);
//                Toast.makeText(MainActivity.this, "Logout Selected", Toast.LENGTH_SHORT).show();
                break;
            case R.id.business:
                this.query = "business";
                retrieveJson("business",country,API_KEY, false);
//                Toast.makeText(MainActivity.this, "Logout Selected", Toast.LENGTH_SHORT).show();
                break;
            case R.id.entertainment:
                this.query = "entertainment";
                retrieveJson("entertainment",country,API_KEY, false);
//                Toast.makeText(MainActivity.this, "Logout Selected", Toast.LENGTH_SHORT).show();
                break;
            default:
                break;
        }
        drawerLayout.closeDrawers();
//        dialog.closeOptionsMenu();
        return true;
    }


    public void getTextFromImage(Bitmap bitmap)
    {
        Log.i("Image", "getTextFromImage: " + bitmap);
        InputImage image = InputImage.fromBitmap(bitmap,0);
        TextRecognizer recognizer = TextRecognition.getClient(TextRecognizerOptions.DEFAULT_OPTIONS);
        Task<Text> result =
                recognizer.process(image).addOnSuccessListener(new OnSuccessListener<Text>() {
                    @Override
                    public void onSuccess(Text text) {
                        Log.i("SuCCEss", "onSuccess: " + text);
                        Text result = text;
                        String resultText = result.getText();
                        String val = "";
                        for (Text.TextBlock block : result.getTextBlocks()) {
                            String blockText = block.getText();
                            Point[] blockCornerPoints = block.getCornerPoints();
                            Rect blockFrame = block.getBoundingBox();



                            for (Text.Line line : block.getLines()) {
                                String lineText = line.getText();
                                Log.i("Text", lineText);// prints line output
                                val = val + lineText + "\n";
                            }


                            Log.i("val", "val: " + val);// prints line output
                            final String country = getCountry();
                            query = "specific-data";
                            retrieveJson(val,country,API_KEY, true);
//                            ((TextView) findViewById(R.id.textView2)).setText(val);
                        }
                    }
                }).addOnFailureListener(new OnFailureListener() {
                    @Override
                    public void onFailure(@NonNull Exception e) {
                        Log.e("Error", "onFailure: " + e );
                    }
                });
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == MY_CAMERA_PERMISSION_CODE)
        {
            if (grantResults[0] == PackageManager.PERMISSION_GRANTED)
            {
                Toast.makeText(this, "camera permission granted", Toast.LENGTH_LONG).show();
                Intent cameraIntent = new Intent(android.provider.MediaStore.ACTION_IMAGE_CAPTURE);
                startActivityForResult(cameraIntent, CAMERA_REQUEST);
            }
            else
            {
                Toast.makeText(this, "camera permission denied", Toast.LENGTH_LONG).show();
            }
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        Log.i("onActivityResult", "onActivityResult: ");
        if (requestCode == CAMERA_REQUEST && resultCode == Activity.RESULT_OK)
        {
            Bitmap photo = (Bitmap) data.getExtras().get("data");
            getTextFromImage(photo);
        }

        switch (requestCode) {
            case 10:
                if (resultCode == RESULT_OK && data != null) {
                    ArrayList<String> result = data.getStringArrayListExtra(RecognizerIntent.EXTRA_RESULTS);
                    Log.i("SPEECH TO TEXT", "onActivityResult: "+(result.get(0)));
                    speechToText = result.get(0);
                            final String country = getCountry();
                         query = "specific-data";
                         retrieveJson(speechToText,country,API_KEY, true);
                }
                break;
        }

    }


    public void openCamera(View v)
    {
        Button photoButton = (Button) this.findViewById(R.id.cam);
        photoButton.setOnClickListener(new View.OnClickListener()
        {
            @RequiresApi(api = Build.VERSION_CODES.M)
            @Override
            public void onClick(View v)
            {
                if (checkSelfPermission(Manifest.permission.CAMERA) != PackageManager.PERMISSION_GRANTED)
                {
                    requestPermissions(new String[]{Manifest.permission.CAMERA}, MY_CAMERA_PERMISSION_CODE);
                }
                else
                {
                  Intent cameraIntent = new Intent(android.provider.MediaStore.ACTION_IMAGE_CAPTURE);
                    startActivityForResult(cameraIntent, CAMERA_REQUEST);
                }
            }
        });
    }
}
