import titleCase from 'title-case'

export default class Metadata {
  static async fromItunes(sourceURL) {
    let type, title, subtitle, uri, artURL
    let data = {}

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

          uri = `applemusic/next/${type}:${itunesID}`

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
