import titleCase from 'title-case'

export default class Metadata {
  static async fetchMetadata(url) {
    const sourceURL = new URL(url)

    if (sourceURL.host === 'itunes.apple.com') {
      return Metadata.fromItunes(sourceURL)
    } else if (sourceURL.host === 'open.spotify.com') {
      return Metadata.fromSpotify(sourceURL)
    }
  }

  static async fromSpotify(sourceURL) {
    let type, title, subtitle, uri, artURL

    const baseURL = process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : ''
    const pathParts = sourceURL.pathname.split('/')

    const spotifyID = pathParts[pathParts.length - 1]
    const contentType = pathParts[pathParts.length - 2]
    const user = pathParts[pathParts.length - 3]

    const metadataURL = `${baseURL}/metadata/spotify?type=${contentType}&uri=${spotifyID}&user=${user}`

    let metadata = await fetch(metadataURL)
      .then(results => {
        return results.json()
      })
      .then(data => {
        type = contentType
        title = data.name
        uri = `spotify/now/${data.uri}`

        if (data.artists && data.artists[0]) {
          subtitle = data.artists[0].name
        }

        if (contentType === 'track') {
          if (data.album && data.album.images && data.album.images[0]) {
            artURL = data.album.images[0].url
          }
        } else {
          if (data.images && data.images[0]) {
            artURL = data.images[0].url
          }
        }

        return {type: type, artURL: artURL, title: title, subtitle: subtitle, uri: uri}
      })
      .catch(error => {
        console.error(error)
        return {}
      })

    return metadata
  }

  static async fromItunes(sourceURL) {
    let type, title, subtitle, uri, artURL

    if (sourceURL.pathname.includes('/album/')) {
      const collectionID = sourceURL.pathname.split('/').pop()
      const fragmentID = sourceURL.searchParams.get('i')
      const itunesID = fragmentID || collectionID

      let metadata = await fetch(`https://itunes.apple.com/lookup?id=${itunesID}`)
        .then(results => {
          return results.json()
        })
        .then(data => {
          const result = data.results[0]

          artURL = result.artworkUrl100.replace('100x100bb.jpg', '1400x1400bb.jpg')

          if (result.kind === 'song') {
            type = 'song'
            title = result.trackName
            subtitle = result.artistName
          } else if (result.collectionType === 'Album') {
            type = 'album'
            title = result.collectionName
            subtitle = result.artistName
          }

          uri = `applemusic/now/${type}:${itunesID}`

          return {type: type, artURL: artURL, title: title, subtitle: subtitle, uri: uri}
        })

      return metadata
    } else {
      if (sourceURL.pathname.includes('/playlist/')) {
        type = 'playlist'
        title = titleCase(sourceURL.pathname.split('/')[3].replace('-', ' '))
        subtitle = 'Apple Music'
        artURL = ''
      } else if (sourceURL.pathname.includes('/station/')) {
        type = 'station'
        title = titleCase(sourceURL.pathname.split('/')[3].replace('-', ' '))
        subtitle = 'Apple Music'
        artURL = ''
      }

      return {type: type, artURL: artURL, title: title, subtitle: subtitle}
    }
  }
}
