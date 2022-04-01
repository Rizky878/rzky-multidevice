<div align="center">
<img src="https://telegra.ph/file/1ad6f99162dc762ccabc2.jpg" width="150" height="150" border="0" alt="PFP">

# Rzky Multi Device
### Gunakan dengan risiko Anda sendiri!

## [![JavaScript](https://img.shields.io/badge/JavaScript-d6cc0f?style=for-the-badge&logo=javascript&logoColor=white)](https://javascript.com) [![NodeJS](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)

> Build with Baileys and new Map() ( as a command handler ) <br />

</div><br />
<br />

## Highlights

- [√] Simple Penggunaan
- [√] Mudah digunakan dan,
- [√] Mudah untuk dirawat/diperbaiki

## Config
Isi semua yang dibutuhkan di file [`config.json`](https://github.com/Rizky878/rzky-multidevice/blob/main/config.json)<br />

## Request or report
Untuk request dan report bisa chat saya disini [Whatsapp](https://wa.me/6282387804410)

### Dibutuhkan
1. [nodejs](https://nodejs.org/en/download) 16x/17x
2. [ffmpeg](https://ffmpeg.org)
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

### Install libwebp
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
* [`RzkyFdlh`](https://github.com/Rizky878/rzky-multidevice)
