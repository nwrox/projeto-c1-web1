const color = Chart.helpers
  .color

const addListeners = checked => {
  const chkComments = document.querySelector('#chkComments')
  const chkLikes = document.querySelector('#chkLikes')
  const chkRetweets = document.querySelector('#chkRetweets')

  console.log({ checked })

  chkComments.checked = checked
  chkLikes.checked = checked
  chkRetweets.checked = checked

  chkComments.addEventListener('change', () => {
    const {
      dashboardChart: {
        proxy: { showComments }
      }
    } = window

    window.dashboardChart
      .proxy
      .showComments = !showComments
  })

  chkLikes.addEventListener('change', () => {
    const {
      dashboardChart: {
        proxy: { showLikes }
      }
    } = window

    window.dashboardChart
      .proxy
      .showLikes = !showLikes
  })

  chkRetweets.addEventListener('change', () => {
    const {
      dashboardChart: {
        proxy: { showRetweets }
      }
    } = window

    window.dashboardChart
      .proxy
      .showRetweets = !showRetweets
  })
}

const chartConfig = {
  type: 'line',
  data: {
    datasets: []
  },
  options: {
    legend: {
      display: true,
        labels: {
          display: false
        }
    },
    responsive: true,
    title: {
      display: true,
      fontSize: 20,
      text: 'Twitter\'s interactions'
    },
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero:true,
          fontSize: 11,
        }
      }],
      xAxes: [{
        type: 'time',
        time: {
          parser: 'YYYY/MM/DD HH:mm:ss',
          tooltipFormat: 'll HH:mm'
        }
      }]
    }
  }
}

const dashboardData = {
  comments: [],
  likes: [],
  retweets: []
}

const dataUrl = 'https://gist.githubusercontent.com/nwrox/597de17e760a7efa3d6803def36d6d8c/raw/5caf3adfa76b851789e8ae369bdb0aba2e7c8427/data.js'

const getChartData = () => fetch(dataUrl).then(res => res.json())
  .then(({ comments, likes, retweets }) => {
    const coms = comments.map(c => {
      c.x = new Date(c.x)

      return c
    })
    const lks = likes.map(l => {
      l.x = new Date(l.x)

      return l
    })
    const rts = retweets.map(r => {
      r.x = new Date(r.x)

      return r
    })

    dashboardData.comments = coms
    dashboardData.likes = lks
    dashboardData.retweets  = rts

    window.dashboardChart
      .datasets = {
        comments: {
          label: '# of Comments',
          data: coms,
          backgroundColor: color('rgb(75, 192, 192)').alpha(0.5)
            .rgbString(),
          borderColor: 'rgb(75, 192, 192)',
          fill: false,
          pointBorderColor: 'rgb(0, 0, 0)',
          pointRadius: 4
        },
        likes: {
          label: '# of Likes',
          data: lks,
          backgroundColor: color('rgb(255, 99, 132)').alpha(0.5)
            .rgbString(),
          borderColor: 'rgb(255, 99, 132)',
          fill: false,
          pointBorderColor: 'rgb(0, 0, 0)',
          pointRadius: 4
        },
        retweets: {
          label: '# of Retweets',
          data: rts,
          backgroundColor: color('rgb(54, 162, 235)').alpha(0.5)
            .rgbString(),
          borderColor: 'rgb(54, 162, 235)',
          fill: false,
          pointBorderColor: 'rgb(0, 0, 0)',
          pointRadius: 4
        }
      }

    return chartConfig
  })


const proxy = new Proxy({
  showComments: false,
  showLikes: false,
  showRetweets: false
}, {
  set (target, key, value) {
    const d = window.lineChart
      .data
      .datasets

    if (key === 'showComments') {
      target[key] = value

      if (!value) {
        window.lineChart
          .data
          .datasets = d.filter(ds => ds.label !== '# of Comments')
        window.lineChart
          .update()

        return
      }

      window.lineChart
          .data
          .datasets
          .push(window.dashboardChart.datasets['comments'])
      window.lineChart
        .update()
    }

    if (key === 'showLikes') {
      target[key] = value

      if (!value) {
        window.lineChart
          .data
          .datasets = d.filter(ds => ds.label !== '# of Likes')
        window.lineChart
          .update()

        return
      }

      window.lineChart
          .data
          .datasets
          .push(window.dashboardChart.datasets['likes'])
      window.lineChart
        .update()
    }

    if (key === 'showRetweets') {
      target[key] = value

      if (!value) {
        window.lineChart
          .data
          .datasets = d.filter(ds => ds.label !== '# of Retweets')
        window.lineChart
          .update()

        return
      }

      window.lineChart
          .data
          .datasets
          .push(window.dashboardChart.datasets['retweets'])
      window.lineChart
        .update()
    }
  }
})

window.dashboardChart = {
  addListeners, dashboardData, getChartData, proxy
}
