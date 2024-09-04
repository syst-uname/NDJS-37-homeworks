const error404 = async (req, res) => {
  res.status(404).json({
    error: 'Not found',
    status: 'error'
  })
}

export default error404