exports.register = async (req, res, next) => {

}

exports.login = async (req, res, next) => {
    // if fine then dashboard
    res.render('dashboard');
}

exports.isAuthenticated = async function (req, res, next) {
    // only for local strategy - session
    if (req.isAuthenticated()) next();
    else return res.send('Unaunthenticated');
}

exports.oauthUsingGoogle = async function (req, res) {
    res.send('welcome with google');
}

exports.oauthUsingGithub = async function (req, res) {
    res.send('welcome with github');
}