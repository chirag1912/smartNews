package com.example.newsapplication;

import android.content.Context;
import android.content.Intent;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.cardview.widget.CardView;
import androidx.recyclerview.widget.RecyclerView;

import com.example.newsapplication.Model.Articles;
import com.example.newsapplication.Model.Source;
import com.squareup.picasso.Picasso;

import org.ocpsoft.prettytime.PrettyTime;
import org.ocpsoft.prettytime.format.SimpleTimeFormat;

import java.text.ParseException;
import java.text.SimpleDateFormat;
//import java.time.LocalDateTime;
//import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.List;
import java.util.Locale;

public class Adapter extends RecyclerView.Adapter<Adapter.ViewHolder> {

    Context context;
    List<Articles> articles;
    List<Source> sources;
    int viewType;


    public Adapter(Context context, List<Articles> articles, List<Source> sources) {
        this.context = context;
        this.articles = articles;
        this.sources = sources;
    }

    public int setItemViewType(int viewType)
    {
        this.viewType = viewType;
        return this.viewType;
    }
    @Override
    public int getItemViewType(int position) {

        return super.getItemViewType(position);
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
      View view ;
      if (this.viewType == 1)
    {
     view = LayoutInflater.from(parent.getContext()).inflate(R.layout.items,parent,false);
    }
      else
        {
            view = LayoutInflater.from(parent.getContext()).inflate(R.layout.items2,parent,false);
        }
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull final ViewHolder holder, int position) {
//       Articles a = null;

       if (this.viewType == 1)
       {
           final Articles a =  articles.get(position);
           String imageUrl = a.getUrlToImage();
           String url = a.getUrl();

           Picasso.with(context).load(imageUrl).into(holder.imageView);

           holder.tvTitle.setText(a.getTitle());
           holder.tvSource.setText(a.getAuthor());
//           SimpleDateFormat formatter = new SimpleDateFormat("EEE MMM dd HH:mm:ss Z yyyy",, Locale.US);

//           try {
//     SimpleDateFormat
//               Log.d("date", "onBindViewHolder() returned: " + date);
               holder.tvDate.setText(a.getPublishedAt().toString());
//           } catch (ParseException e) {
//               e.printStackTrace();
//           }
//           holder.tvDate.setText("");

           holder.cardView.setOnClickListener(new View.OnClickListener() {
               @Override
               public void onClick(View v) {
                   Intent intent = new Intent(context,Detailed.class);
                   intent.putExtra("title",a.getTitle());
                   intent.putExtra("source",a.getSource().getName());
                   intent.putExtra("time",dateTime(a.getPublishedAt()));
                   intent.putExtra("desc",a.getDescription());
                   intent.putExtra("imageUrl",a.getUrlToImage());
                   intent.putExtra("url",a.getUrl());
                   context.startActivity(intent);
               }
           });
       }
       else
       {

           final Source b =  sources.get(position);
           String url = b.getUrl();
           holder.tvTitle.setText(b.getName());
           holder.tvSource.setText("GoogleNewAPI");
           holder.tvDesc.setText(b.getDescription());
//           holder.tvDate.setText("");

           holder.cardView.setOnClickListener(new View.OnClickListener() {
               @Override
               public void onClick(View v) {
                   Intent intent = new Intent(context,Detailed.class);
                   intent.putExtra("title",b.getName());
                   intent.putExtra("source","GoogleNewAPI");
//                   intent.putExtra("time",dateTime(a.getPublishedAt()));
                   intent.putExtra("desc",b.getDescription());
//                   intent.putExtra("imageUrl",a.getUrlToImage());
                   intent.putExtra("url",b.getUrl());
                   intent.putExtra("category",b.getCategory());

                   context.startActivity(intent);
               }
           });
       }


    }

    @Override
    public int getItemCount() {
        if (this.viewType == 1)
        {
            return articles.size();
        }
        else {
            return sources.size();
        }

    }

    public class ViewHolder extends RecyclerView.ViewHolder {
        TextView tvTitle,tvSource,tvDate,tvDesc;
        ImageView imageView;
        CardView cardView;

        public ViewHolder(@NonNull View itemView) {
            super(itemView);

            tvTitle = itemView.findViewById(R.id.tvTitle);
            tvSource = itemView.findViewById(R.id.tvSource);
            tvDate = itemView.findViewById(R.id.tvDate);
            imageView = itemView.findViewById(R.id.image);
            cardView = itemView.findViewById(R.id.cardView);
            tvDesc = itemView.findViewById(R.id.tvDesc);
        }
    }


    public String dateTime(String t){
        PrettyTime prettyTime = new PrettyTime(new Locale(getCountry()));
        String time = null;
        try {
            SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:",Locale.ENGLISH);
            Date date = simpleDateFormat.parse(t);
            time = prettyTime.format(date);
        }catch (ParseException e) {
            e.printStackTrace();
        }
        return time;

    }

    public String getCountry(){
        Locale locale = Locale.getDefault();
        String country = locale.getCountry();
        return country.toLowerCase();
    }
}
