const header = document.getElementById('header')

let ctx = null

function play(connection, source) {
  source.connect(ctx.destination)
  source.start()
}

function noise(noiseLength = 1) {
  ctx = ctx || new AudioContext()
  const bufferSize = ctx.sampleRate * noiseLength
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)

  let data = buffer.getChannelData(0) // get data

  // fill the buffer with noise
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1
  }

  let bandpass = ctx.createBiquadFilter()
  bandpass.type = 'bandpass'
  bandpass.frequency.value = 400

  const bufferSource = ctx.createBufferSource()
  bufferSource.buffer = buffer

  bufferSource.connect(ctx.destination)

  bandpass.connect(ctx.destination)
  bufferSource.start()
}

async function getFile(path) {
  const response = await fetch(path)
  const arrayBuffer = await response.arrayBuffer()
  const audioBuffer = await ctx.decodeAudioData(arrayBuffer)
  return audioBuffer
}

function sin(length, freq) {
  ctx = ctx || new AudioContext()

  const bufferSize = ctx.sampleRate * length
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)

  const data = buffer.getChannelData(0)

  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.sin((i / ctx.sampleRate) * 2 * 3.14159 * freq)
  }

  const bufferSource = ctx.createBufferSource()
  bufferSource.buffer = buffer

  bufferSource.connect(ctx.destination)
  bufferSource.start()
}

function square(length, freq) {
  ctx = ctx || new AudioContext()

  const bufferSize = ctx.sampleRate * length
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)

  const data = buffer.getChannelData(0)

  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.floor(Math.sin((i / ctx.sampleRate) * 2 * 3.14159 * freq))
  }

  const bufferSource = ctx.createBufferSource()
  bufferSource.buffer = buffer

  bufferSource.connect(ctx.destination)
  bufferSource.start()
}

function sample() {
  console.log('click click')
  ctx = ctx || new AudioContext()

  getFile('/click.wav').then(sample => {
    console.log('sample?', sample)
    const sampleSource = ctx.createBufferSource()
    sampleSource.buffer = sample
    sampleSource.connect(ctx.destination)
    sampleSource.start()
  })
}
