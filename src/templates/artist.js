import React, { useState, useEffect, useContext } from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import SEO from "../components/seo"
import getPlaylistTracks from "../services/get-playlist-tracks"
import Playlist from "../components/playlist"
import "./artist.scss"
import Top from "./Top"
import Mid from "./Mid"
import { releasesButton, playlistButton } from "./selectors"
import Player from "../components/player"
import { playerContext } from "../../wrap-with-provider"

export const query = graphql`
  query(
    $regexName: String!
    $profileUrl: String!
    $midUrl: String!
    $midUrlDesk: String!
  ) {
    jsonFiles(name: { regex: $regexName }) {
      name
      spotify
      soundcloud
      instagram
      bandcamp
      curated_playlist
      soundcloud_release_trackId
    }
    profile: cloudinaryMedia(public_id: { eq: $profileUrl }) {
      url
    }
    mid: cloudinaryMedia(public_id: { eq: $midUrl }) {
      url
    }
    midDesk: cloudinaryMedia(public_id: { eq: $midUrlDesk }) {
      url
    }
  }
`

const viewStates = {
  RELEASES: "releases",
  PLAYLIST: "playlist",
  ABOUT: "about",
}
export const isDesk = () => window.innerWidth > 768

const Artist = props => {
  const [tracks, setTracks] = useState()
  const [view, setView] = useState(viewStates.RELEASES)
  const context = useContext(playerContext)

  useEffect(() => {
    const RELEASE_BOX = document.querySelector("#RELEASES")
    if (!RELEASE_BOX) return
    if (view === viewStates.PLAYLIST) {
      playlistButton().querySelector("text").style.fill = "#f06a6a"
      releasesButton().querySelector("text").style.fill = "white"
      RELEASE_BOX.style.visibility = "hidden"
    }
    if (view === viewStates.RELEASES) {
      playlistButton().querySelector("text").style.fill = "white"
      releasesButton().querySelector("text").style.fill = "#f06a6a"
      RELEASE_BOX.style.visibility = "visible"
    }
  }, [view])

  const getArtistPlaylist = () => {
    getPlaylistTracks(props.data.jsonFiles.curated_playlist)
      .then(tracks => {
        setTracks(tracks)
        // context.setSpotifyAuth(true)
      })
      .catch(err => {
        // context.setSpotifyAuth(false)
      })
  }

  useEffect(() => {
    context.getAppToken().then(getArtistPlaylist)
    context.getDevices()
    context.initSoundcloud(props.data.jsonFiles.soundcloud_release_trackId)
  }, [])

  useEffect(() => {
    const currentToken = localStorage.getItem("arcsasT")
    if (currentToken) {
      console.log("check the token")
      // getUser(currentToken).then(data => setUser(data.display_name))
    }

    const handlerEvent = event => {
      console.log("index storage event")
      if (event.key !== "arcsasT") return
      // getArtistPlaylist()
      context.getDevices()
    }
    if (window) window.addEventListener("storage", handlerEvent, false)

    return () => window.removeEventListener("storage", handlerEvent, false)
  }, [])
  console.log(props)
  if (typeof window === "undefined")
    return (
      <div>
        <SEO title={props.data.jsonFiles.name} image={props.data.profile.url} />
      </div>
    )
  return (
    <Layout>
      <SEO title={props.data.jsonFiles.name} image={props.data.profile.url} />
      <Top
        profileImgUrl={props.data.profile.url}
        isDesk={isDesk}
        data={props.data.jsonFiles}
        artistName={props.data.jsonFiles.name}
        setView={setView}
        viewStates={viewStates}
        spotifyAuth={context.spotifyAuth}
      />
      <Mid
        mid={props.data.mid}
        midDesk={props.data.midDesk}
        releaseTrackId={props.data.jsonFiles.soundcloud_release_trackId}
      />
      {view === viewStates.PLAYLIST && (
        <Playlist
          tracks={tracks}
          playlistUri={props.data.jsonFiles.curated_playlist}
        />
      )}
      <Player />
    </Layout>
  )
}

export default Artist
