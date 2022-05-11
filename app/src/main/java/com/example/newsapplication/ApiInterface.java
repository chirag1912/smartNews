package com.example.newsapplication;

import com.example.newsapplication.Model.Headlines;

import retrofit2.Call;
import retrofit2.http.GET;
import retrofit2.http.Query;

public interface ApiInterface {


    @GET("top-headlines")
    Call<Headlines> getHeadlines(
            @Query("category") String query,
            @Query("country") String country,
            @Query("apiKey") String apiKey
    );

    @GET("everything")
    Call<Headlines> getSpecificData(
            @Query("q") String query,
            @Query("apiKey") String apiKey
    );

    @GET("top-headlines")
    Call<Headlines> getCategoryData(

            @Query("country") String country,
            @Query("apiKey") String apiKey
//            @Query("category") String query,
//            @Query("apiKey") String apiKey
    );



}
