let login = false;

exports.login = (req, res) => {
  try {
    const body = req.body;

    if (!body?.email || !body?.password) {
      res.status(403).json({
        status: "Fail",
        message: "Enter your credentials",
      });
      return;
    }
  } catch (e) {
    console.log(e);
  }

  login = true;
};

exports.checkStatus = () => login;
