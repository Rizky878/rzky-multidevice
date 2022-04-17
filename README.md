<div align="center">
<img src="https://telegra.ph/file/1ad6f99162dc762ccabc2.jpg" width="150" height="150" border="0" alt="PFFP">


# Rzky Multi Device
### Gunakan dengan risiko Anda sendiri!

## [![JavaScript](https://img.shields.io/badge/JavaScript-d6cc0f?style=for-the-badge&logo=javascript&logoColor=white)](https://javascript.com) [![NodeJS](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
<a href="https://chat.whatsapp.com/HJonYuPOQk4DO6bmQ5Naru"> <img src="https://img.shields.io/badge/whatsapp-Support_Group-blue?style=social&logo=whatsapp" alt="support" /></a>

> Dibuat dengan Baileys dan Map() ( sebagai command handler ) <br />

</div><br />
<br />



## Options

Options pada command, yang akan mempermudah kamu untuk membuat/menambahkan fitur<br />
```js
{
   name: <String>, // Ex: "menu"
   alias: <Array>, // Ex: ["cmd","help"]
   desc: <String>, // Ex: "Menu adalah command"
   use: <String>,  // Ex: "<teks>"
   category: <String>, // Ex: "umum"
   wait: <Boolean>, // Ex: true
   isOwner: <Boolean>, // Ex: false
   isAdmin: <Boolean>, // Ex: false
   isQuoted: <Boolean>, // Ex: false
   isGroup: <Boolean>, // Ex: false
   isBotAdmin: <Boolean>, // Ex: false
   query: <Boolean and String>, // Ex: "Tunggu Sebentar" / true
   isPrivate: <Boolean>, // Ex: false
   isSpam: <Boolean>, // Ex: true
   isLimit: <Boolean>, // Ex: true
   isLimitGame: <Boolean>, // Ex: false
   noPrefix: <Boolean>, // Ex: true
   isPremium: <Boolean>, // Ex: false
   isMedia: { 
      isQVideo: <Boolean>, // Ex: false
      isQAudio: <Boolean>, // Ex: false
      isQImage: <Boolean>, // Ex: false
      isQSticker: <Boolean>, // Ex: false
      isQDocument: <Boolean>, // Ex: false
   }
   isUrl: <Boolean> // Ex: false
}
```

## Contoh Options

Contoh Command : [`./command/umum/help.js`](https://github.com/Rizky878/rzky-multidevice/blob/main/command/umum/help.js)<br />
```js
{
  name: "help",
  alias: ["h","menu","cmd"],
  desc: "menampilkan menu",
  category: "umum",
  wait: true
}
```

## Highlights

- [x] Simple Penggunaan,
- [x] Mudah digunakan,
- [x] Mudah untuk dirawat/diperbaiki,
- [x] Dan ringan

## Config
Isi semua yang dibutuhkan di file [`config.json`](https://github.com/Rizky878/rzky-multidevice/blob/main/config.json)<br />

## Request atau report bug
Untuk request atau report bug bisa chat saya disini [Whatsapp](https://wa.me/6282387804410)

## Instalasi On Termux

### Clone Repo

```bash
> pkg install
> pkg upgrade
> pkg install git
> pkg install ffmpeg && pkg install libwebp
> pkg install nodejs
> git clone https://github.com/Rizky878/rzky-multidevice/
> cd rzky-multidevice
> npm install --arch=x64 --platform=linux sharp
> npm start
# Scan QR
```

## Instalasi

### Dibutuhkan
1. [Nodejs](https://nodejs.org/en/download) 16x/17x
2. [FFmpeg](https://ffmpeg.org)
3. [libWebP](https://developers.google.com/speed/webp/download)

### Install Ffmpeg
- Untuk pengguna Windows, kamu bisa lihat tutorial disini [WikiHow](https://www.wikihow.com/Install-Ffmpeg-on-Windows)<br />
- Untuk pengguna Linux, kamu bisa pakai manager paket kamu sendiri. Contohnya;

```bash
# apt (Ubuntu)
apt install ffmpeg -y

# pacman (Arch Linux)
pacman -S ffmpeg
```

### Install libWebP
- Untuk pengguna Windows,
1. Unduh libWebP untuk Windows dari [sini](https://developers.google.com/speed/webp/download)
2. Ekstrak ke C:\
3. Ganti nama folder yang diekstrak ke `libwebp`
4. Buka PowerShell dan jalankan perintah berikut;

```cmd
setx /m PATH "C:\libwebp\bin;%PATH%"
```
> Bila sukses terinstal dengan baik, silahkan check dengan perintah berikut di Command Prompt
```cmd
webpmux -version
```

- Untuk pengguna Linux, kamu bisa pakai manager paket kamu. Contohnya;
```bash
# apt (Ubuntu)
apt install libwebp-dev -y

# pacman (Arch Linux)
pacman -S libwebp
```

### Clone Repo
```bash
# clone repo
git clone https://github.com/Rizky878/rzky-multidevice

# ubah posisi direktori kamu
cd rzky-multidevice

# install semua module
npm install
# atau
yarn install

# bila libray @adiwajshing/baileys error, jalan kan kode yg ada dibawah ini

cd ./node_modules/@adiwajshing/baileys
npm install -g typescript
npm run build:tsc
```

### Start Bot
Start and Scan QR<br />

```bash
npm start
```

# Thanks To

* [`Faiz Bastomi`](https://github.com/FaizBastomi)
* [`Dehante`](https://github.com/Dehanjing)
* [`RzkyFdlh`](https://github.com/Rizky878)
