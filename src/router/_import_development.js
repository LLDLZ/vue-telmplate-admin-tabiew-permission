module.exports = file => {
  return (resolve) => require([`@/views/${file}`], resolve)
}
