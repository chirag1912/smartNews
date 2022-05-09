package com.example.newsapplication;

import androidx.annotation.NonNull;
import androidx.appcompat.app.ActionBarDrawerToggle;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.drawerlayout.widget.DrawerLayout;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

import android.annotation.SuppressLint;
import android.app.Dialog;
import android.os.Bundle;
import android.speech.tts.TextToSpeech;
import android.util.Log;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ProgressBar;
import android.widget.Toast;

import com.example.newsapplication.Model.Articles;
import com.example.newsapplication.Model.Headlines;
import com.example.newsapplication.Model.Source;
import com.google.android.material.navigation.NavigationView;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class MainActivity extends AppCompatActivity implements NavigationView.OnNavigationItemSelectedListener {

    RecyclerView recyclerView;
    SwipeRefreshLayout swipeRefreshLayout;
    Button  btnAboutUs;
    Dialog dialog;
    final String API_KEY = "a283830f953a4abda0897c4178511055";
    Adapter adapter;
    List<Articles>  articles = new ArrayList<>();
    List<Source>  sources = new ArrayList<>();
    Button mic;
     TextToSpeech mTTS;

    //For Navigation Bar
    DrawerLayout drawerLayout;
    Toolbar toolbar;
    NavigationView navigationView;
    ActionBarDrawerToggle toggle;

    String query;


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
        btnAboutUs = findViewById(R.id.aboutUs);
        dialog = new Dialog(MainActivity.this);

        mic = findViewById(R.id.mic);

        recyclerView.setLayoutManager(new LinearLayoutManager(this));
        final String country = getCountry();


        swipeRefreshLayout.setOnRefreshListener(new SwipeRefreshLayout.OnRefreshListener() {
            @Override
            public void onRefresh() {
               switch (query) {
                   case "headlines":
                       retrieveJson("", country, API_KEY);
                       break;
                   case "health":
                       retrieveJson("health",country,API_KEY);
                       break;

                   case "technology":
                       retrieveJson("technology",country,API_KEY);
                       break;

                   case "science":
                       retrieveJson("science",country,API_KEY);
                       break;

                   case "business":
                       retrieveJson("business",country,API_KEY);
                       break;

                   case "entertainment":
                       retrieveJson("entertainment",country,API_KEY);
                       break;

                   case "sports":
                       retrieveJson("sports",country,API_KEY);
                       break;
                   default:
                       break;


               }

                if (query == "headlines")
                {
                    retrieveJson("",country,API_KEY);
                }
               else if (query == "headlines")
                {
                    retrieveJson("",country,API_KEY);
                }

            }
        });
        retrieveJson("",country,API_KEY);

        btnAboutUs.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                showDialog();
            }
        });



        mTTS = new TextToSpeech(this, new TextToSpeech.OnInitListener() {
            @Override
            public void onInit(int status) {
                if (status == TextToSpeech.SUCCESS) {
                    int result = mTTS.setLanguage(Locale.US);

                    if (result == TextToSpeech.LANG_MISSING_DATA
                            || result == TextToSpeech.LANG_NOT_SUPPORTED) {
                        Log.e("TTS", "Language not supported");
                    } else {
                        mic.setEnabled(true);
                    }
                } else {
                    Log.e("TTS", "Initialization failed");
                }
            }
        });

        mic.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
               // code to get headlines an read all of them

                String text = " Welcome to Smart News! Hope you have a good day!";



                for(int i=0;i<articles.size();i++){

                    mTTS.speak(articles.get(i).getTitle(), TextToSpeech.QUEUE_ADD, null);
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

    public void retrieveJson(String query ,String country, String apiKey){

        Call<Headlines> call;
        swipeRefreshLayout.setRefreshing(true);
        if (query == "")
        {
            call = ApiClient.getInstance().getApi().getHeadlines(country, apiKey);
            Log.d("articles", "onResponse() returned: headlines " + call);
        }
        else {
            call = ApiClient.getInstance().getApi().getCategoryData(query, apiKey);
            Log.d("articles", "onResponse() returned: category data " + call);
        }

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
                retrieveJson("",country,API_KEY);
            case R.id.sports:
                this.query = "sports";
                retrieveJson("sports",country,API_KEY);
//                Toast.makeText(MainActivity.this, "Profile Selected", Toast.LENGTH_SHORT).show();
                break;
            case R.id.technology:
                this.query = "technology";
                retrieveJson("technology",country,API_KEY);
//                Toast.makeText(MainActivity.this, "Contact us Selected", Toast.LENGTH_SHORT).show();
                break;
            case R.id.science:
                this.query = "science";
                retrieveJson("science",country,API_KEY);
//                Toast.makeText(MainActivity.this, "About us Selected", Toast.LENGTH_SHORT).show();
                break;
            case R.id.health:
                this.query = "health";
                retrieveJson("health",country,API_KEY);
//                Toast.makeText(MainActivity.this, "Logout Selected", Toast.LENGTH_SHORT).show();
                break;
            case R.id.business:
                this.query = "business";
                retrieveJson("business",country,API_KEY);
//                Toast.makeText(MainActivity.this, "Logout Selected", Toast.LENGTH_SHORT).show();
                break;
            case R.id.entertainment:
                this.query = "entertainment";
                retrieveJson("entertainment",country,API_KEY);
//                Toast.makeText(MainActivity.this, "Logout Selected", Toast.LENGTH_SHORT).show();
                break;
            default:
                break;
        }
        return false;
    }
}
