- dotnet sdk版：
FROM  mcr.microsoft.com/dotnet/sdk:3.1

COPY ./netcoreapp3.1 /dotnet

WORKDIR /dotnet

RUN apt-get update -y && apt-get install -y libgdiplus && apt-get clean && ln -s /usr/lib/libgdiplus.so /usr/lib/gdiplus.dll

EXPOSE 5010

CMD ["dotnet", "**.dll"]
```
> linux版的docker调用System.Drawing.Common时可能会报错，参考博文[https://www.cnblogs.com/insipid/p/14617582.html]


-----------

- CentOs版：
```
FROM centos:latest

COPY ./netcoreapp3.1 /dotnet

WORKDIR /dotnet

RUN yum install autoconf automake libtool freetype-devel fontconfig libXft libexif giflib libjpeg-turbo libpng giflib libtiff libexif glib2 cairo -y \
&& yum install dotnet-sdk-3.1 -y \
        && rpm -ivh https://download-ib01.fedoraproject.org/pub/epel/8/Everything/x86_64/Packages/l/libgdiplus-6.0.4-3.el8.x86_64.rpm

EXPOSE 5010

CMD ["dotnet", "*.dll"]   
```

- docker build -t demo:1.0 .

- docker run -d -p port1:port4 image 