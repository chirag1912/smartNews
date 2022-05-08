package com.example.newsapplication.Model;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import java.util.List;

public class Headlines {

    @SerializedName("sources")
    @Expose
    private List<Source> sources;

    @SerializedName("status")
    @Expose
    private String status;

    @SerializedName("totalResults")
    @Expose
    private String totalResults;

    @SerializedName("articles")
    @Expose
    private List<Articles> articles;

//    public String getStatus() {
//        return status;
//    }
//ing getStatus() {
////        return status;
////    }
////
////    public void setStatu
//    public void setStatus(String status) {
//        this.status = status;
//    }

    public String getTotalResults() {
        return totalResults;
    }

    public void setTotalResults(String totalResults) {
        this.totalResults = totalResults;
    }

    public List<Articles> getArticles() {
        return articles;
    }

    public void setArticles(List<Articles> articles) {
        this.articles = articles;
    }


    public List<Source> getSources() {
        return sources;
    }

    public void setSources(List<Source> Source) {
        this.sources = sources;
    }




}
