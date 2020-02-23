import titleCase from 'title-case'

export default class Metadata {
  static async fetchMetadata(url) {
    const sourceURL = new URL(url)

    if (sourceURL.host === 'music.apple.com') {
      return Metadata.fromItunes(sourceURL)
    } else if (sourceURL.host === 'open.spotify.com') {
      return Metadata.fromSpotify(sourceURL)
    } else if (sourceURL.host === 'www.netflix.com') {
      return Metadata.fromNetflix(sourceURL)
    } else if (sourceURL.host === 'areena.yle.fi') {
      return Metadata.fromYLEAreena(sourceURL)
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
        uri = `spotify/queue/${data.uri}`

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

          uri = `applemusic/queue/${type}:${itunesID}`

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

  static async fromNetflix(sourceURL) {
    const uri = 'https://' + sourceURL.host + sourceURL.pathname.replace('/Kids', '')
    const baseURL = process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : ''
    const metadataURL = `${baseURL}/metadata/netflix?url=${uri}`
    const metadata = await fetch(metadataURL)
      .then(results => {
        return results.json()
      })
      .then(data => {
        return {
          artURL: data.hero_image_url,
          title: data.title,
          subtitle: data.year,
        }
      })
    return Object.assign(metadata, {type: 'movie', uri: uri})
  }

  static async fromYLEAreena(sourceURL) {
    const url = 'https://' + sourceURL.host + sourceURL.pathname
    const baseURL = process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : ''
    const metadataURL = `${baseURL}/metadata/yleareena?url=${url}`
    const metadata = await fetch(metadataURL)
      .then(results => {
        return results.json()
      })
      .then(data => {
        return {
          artURL: data.cover_image,
          title: data.title,
        }
      })
    return metadata
  }

  static async fromDLNA() {
    let dlna_items = await fetch('/dlna-media').then(results => {
      return results.json()
    })
    console.log(dlna_items)
    return dlna_items
  }
}
