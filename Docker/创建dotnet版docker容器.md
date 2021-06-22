- Ubuntu版：
    - DockerFile:
```
FROM  mcr.microsoft.com/dotnet/sdk:3.1

COPY ./netcoreapp3.1 /dotnet

WORKDIR /dotnet

RUN apt-get update \
    && apt install apt-utils -y \
    && apt-get install apt-transport-https -y \
    && apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 3FA7E0328081BFF6A14DA29AA6A19B38D3D831EF \
    && apt install ca-certificates -y \
    && echo "deb https://download.mono-project.com/repo/ubuntu stable-xenial main" | tee /etc/apt/sources.list.d/mono-official-stable.list \
    && apt update \
    && apt install libjpeg8 -y \
    && apt install libpng12-0 -y \
    && apt-get install libgdiplus -y

EXPOSE 5010

CMD ["dotnet", "**.dll"]
```

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