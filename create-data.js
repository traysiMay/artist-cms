const fetch = require("node-fetch")
const fs = require("fs")

const plraw = fs.readFileSync("all-artists.json")
const pl = JSON.parse(plraw)

pl.forEach(p => {
  const dir_name = p.name.toLowerCase().split(" ").join("-")
  const modelDir = "models/artist"
  const artistDir = `${modelDir}/${dir_name}`
  try {
    fs.mkdirSync(artistDir)
  } catch (e) {
    console.log(e)
  }
  fs.writeFileSync(`${artistDir}/data.json`, JSON.stringify(p))
})
return
// playlists = []
const token =
  "BQA70253A4QFOBJ2Cey8fqxYhNEnYlpYJlu_rCri6jRJO3I9nkjxgwTzvoJrvhQA08X7couR-MK6c0LcnSU9JC9BjeX4cUj8THqcJ6un6rtNglR-gzk209u4sUN97KNncrq48vH3xD42XSo6DxbLr8ASYnV_3EFmuMY_YYnAFfvGu8P12mzXdDakICaEkgh6bwXand8Cw7zFG8slOkOjcvJJTQgKANFyvv8g0vgdGJDE7D9MaZ-QAzTIWS-TbhLUaZOl51sv4A"
// fetch(`https://api.spotify.com/v1/me/playlists?limit=50&offset=300`, {
//   headers: {
//     Authorization: `Bearer ${token}`,
//   },
// })
//   .then(r => r.json())
//   .then(data => {
//     fs.writeFileSync("playlists6.json", JSON.stringify(data))
//   })
// allData = []
// ;[0, 1, 2, 3, 4, 5, 6].map(n => {
//   const rdata = fs.readFileSync(`playlists${n}.json`)
//   const data = JSON.parse(rdata)

//   data.items.map(d => allData.push(d))
// })
// console.log(allData.length)
// fs.writeFileSync("playlists.json", JSON.stringify(allData))

// return
const rawData = fs.readFileSync("playlists.json")
const playlists = JSON.parse(rawData)

return
sData = []
const pItems = playlists
pItems.map((p, i) => {
  setTimeout(
    () =>
      fetch(
        `https://api.spotify.com/v1/playlists/${p.uri.split(":")[2]}/tracks`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then(r => r.json())
        .then(d => {
          const data = d.items
          const dO = {
            name: "",
            curated_playlist: "",
            spotify: "",
            instagram: "",
            soundcloud: "",
            bandcamp: "",
            soundcloud_release_trackId: "",
          }
          try {
            data[0]
            console.log("ok")
          } catch (err) {
            console.log(data)
          }
          dO.name = data[0].track.artists[0].name
          dO.spotify = data[0].track.artists[0].uri
          dO.curated_playlist = p.uri
          sData.push(dO)
          if (i === pItems.length - 1) {
            fs.writeFileSync("all-artists.json", JSON.stringify(sData))
          }
        }),
    1000 * i
  )
})
