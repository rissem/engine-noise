const sampleRate = 44100
const sqrt2PI = Math.sqrt(2 * Math.PI)
// ctx has to be initialized from a user click
// so start with it undefined and create it lazily as soon as play is triggered
// might be nice to just create it on any user interaction. is that breaking the rules?
let ctx

class Sample {
  constructor(data) {
    this.data = data
  }

  static map(length, f) {
    const data = new Array(length * sampleRate)
    for (let i = 0; i < length * sampleRate; i++) {
      data[i] = f(i / sampleRate)
    }
    return new Sample(data)
  }

  static noise(length) {
    return Sample.map(length, time => Math.random() * 2 - 1)
  }

  static sin(length, freq) {
    return Sample.map(length, time => Math.sin(time * 2 * 3.14159 * freq))
  }

  static square(length, freq) {
    return Sample.map(length, time => Math.round(Math.sin(time * 2 * 3.14159 * freq)))
  }

  // offset must be specified with units {u: 'ms', q: 40}
  // create a class for units? probably worthwhile
  add(s, offset) {
    const newSample = new Array(Math.max(s.length, this.data.length))
    for (let i = 0; i < newSample.length; i++) {
      newSample[i] = (this.data[i] || 0) + (s.data[i] || 0)
    }
    return newSample
  }

  map(f) {
    for (let i = 0; i < this.data.length; i++) {
      this.data[i] = f(this.data[i], i)
    }
    return this
  }

  scale(factor) {
    return this.map(v => v * factor)
  }

  bellEnvelope(sigma) {
    if (!sigma) sigma = this.data.length / 10
    const u = this.data.length / 2
    return this.map(
      (value, index) => value * Math.exp((-1 * Math.pow(index - u, 2)) / (2 * sigma * sigma))
    )
  }

  //maybe play should take ctx as an argument
  play() {
    ctx = ctx || new AudioContext()
    const buffer = ctx.createBuffer(1, this.data.length, sampleRate)
    const channelData = buffer.getChannelData(0)
    for (let i = 0; i < this.data.length; i++) {
      channelData[i] = this.data[i]
    }
    const bufferSource = ctx.createBufferSource()
    bufferSource.buffer = buffer

    bufferSource.connect(ctx.destination)
    bufferSource.start()
  }

  //use d3?
  plot() {}
}

async function getFile(path) {
  const response = await fetch(path)
  const arrayBuffer = await response.arrayBuffer()
  const audioBuffer = await ctx.decodeAudioData(arrayBuffer)
  return audioBuffer
}

function sample() {
  console.log('click click')
  ctx = ctx || new AudioContext()

  getFile('/click.wav').then(sample => {
    const data1 = sample.getChannelData(0)
    const data2 = sample.getChannelData(1)

    // for (let i = 0; i < data1.length; i++) {
    //   data1[i] = Math.random() * data1[i]
    //   data2[i] = Math.random() * data1[i]
    // }

    console.log('sample?', sample)
    const sampleSource = ctx.createBufferSource()
    sampleSource.buffer = sample
    sampleSource.connect(ctx.destination)
    //    sampleSource.start()
    setInterval(() => {
      sampleSource.start()
    }, 1000)
  })
}
