const color = Chart.helpers
  .color

const dashboardData = {
  comments: [],
  likes: [],
  retweets: []
}

const dataUrl = 'https://gist.githubusercontent.com/nwrox/597de17e760a7efa3d6803def36d6d8c/raw/5caf3adfa76b851789e8ae369bdb0aba2e7c8427/data.js'

const getChartData = () => fetch(dataUrl).then(res => res.json())
  .then(({ comments, likes, retweets }) => {
    dashboardData.comments = comments.map(c => {
      c.x = new Date(c.x)

      return c
    })

    dashboardData.likes = likes.map(l => {
      l.x = new Date(l.x)

      return l
    })

    dashboardData.retweets = retweets.map(r => {
      r.x = new Date(r.x)

      return r
    })

    return null
  })

window.dashboardChart = { dashboardData, getChartData }
