const express = require("express");
const router = express.Router();
const connection = require("../database/db");

router.get("/", function (req, res) {
  res.render("auth/login", {
    title: "Login",
    email: "",
    password: "",
  });
});

//authenticate user
router.post("/validateLogin", function (req, res) {
  const { email, password } = req.body;
  connection.query(
    "SELECT * FROM users WHERE email = ? AND password = ?",
    [email, password],
    function (err, rows, fields) {
      if (err) throw err;
      // if user not found
      if (rows.length <= 0) {
        req.flash("error", "Please Enter Correct Email and Password!");
        res.redirect("/");
      } else {
        // if user found
        req.session.details = { loggedin: true, email };
        res.redirect("/home");
      }
    }
  );
});

//display home page
router.get("/home", function (req, res) {
  if (req.session.details && req.session.details.loggedin) {
    connection.query(
      "SELECT * FROM storepassword ORDER BY id desc",
      function (err, rows, fields) {
        if (err) {
          req.flash("error", err);
          // render to views/books/index.ejs
          res.render("home", { data: "" });
        }
        if (rows) {
          // render to views/books/index.ejs
          const data = {
            title: "Dashboard",
            details: req.session.details,
            rows: rows,
          };
          res.render("home", data);
        }
      }
    );
  } else {
    req.flash("error", "Please Login First!");
    res.redirect("/");
  }
});

// Logout user
router.get("/logout", function (req, res) {
  req.session.destroy();
  //req.flash('success', 'Login Again Here');
  res.redirect("/");
});

//password add start here
router.get("/add", function (req, res) {
  if (req.session.details && req.session.details.loggedin) {
    const data = {
      title: "Dashboard",
      details: req.session.details,
    };
    res.render("addpass", data);
  } else {
    req.flash("error", "Please Login First!");
    res.redirect("/");
  }
});

router.post("/addpass", function (req, res) {
  // const {pname, sitelink, username, password } = req.body;
  let pname = req.body.pname;
  let sitelink = req.body.sitelink;
  let username = req.body.username;
  let password = req.body.password;
  let errors = false;

  if (pname.length === 0) {
    errors = true;
    req.flash("error", "* Please Enter Project Name.");
    res.redirect("/add");
  }
  if (sitelink.length === 0) {
    errors = true;
    req.flash("error", "* Please Enter Site link.");
    res.redirect("/add");
  }
  if (username.length === 0) {
    errors = true;
    req.flash("error", "* Please Enter User Name.");
    res.redirect("/add");
  }
  if (password.length === 0) {
    errors = true;
    req.flash("error", "* Please Enter Password.");
    res.redirect("/add");
  }

  if (!errors) {
    var form_data = {
      projectName: pname,
      site_link: sitelink,
      username: username,
      password: password,
    };

    connection.query(
      "INSERT INTO storepassword SET ?",
      form_data,
      function (err, result) {
        if (err) {
          req.flash("error", err);
          // res.render('/add',{
          //   pname:form_data.projectName,
          //   sitelink:form_data.site_link,
          //   username:form_data.username,
          //   password:form_data.password
          // })
        } else {
          req.flash("success", "New Password added successfully.");
          res.redirect("/add");
        }
      }
    );
  }
});
//password add end here

//password edit end here
router.get("/edit/(:id)", function (req, res) {
  if (req.session.details && req.session.details.loggedin) {
    let id = req.params.id;

    connection.query(
      "SELECT * FROM storepassword WHERE id = " + id,
      function (err, rows, fields) {
        if (err) throw err;

        console.log(rows);
        if (rows.length <= 0) {
          req.flash("error", "Password Details not found with id = " + id);
          res.redirect("/home");
        }
        if (rows) {
          const data = {
            title: "Dashboard",
            details: req.session.details,
            rows: rows[0],
          };
          res.render("editpass", data);
        }
      }
    );
  } else {
    req.flash("error", "Please Login First!");
    res.redirect("/");
  }
});
//password edit end here

//password update start here

router.post("/update/:id", function (req, res) {
  let { id, pname, sitelink, username, password } = req.body;
  let errors = false;

  if (pname.length === 0) {
    errors = true;
    req.flash("error", "* Please Enter Project Name.");
    res.redirect("/edit/" + id);
  }
  if (sitelink.length === 0) {
    errors = true;
    req.flash("error", "* Please Enter Site link.");
    res.redirect("/edit/" + id);
  }
  if (username.length === 0) {
    errors = true;
    req.flash("error", "* Please Enter User Name.");
    res.redirect("/edit/" + id);
  }
  if (password.length === 0) {
    errors = true;
    req.flash("error", "* Please Enter Password.");
    res.redirect("/edit/" + id);
  }

  if (!errors) {
    var form_data = {
      projectName: pname,
      site_link: sitelink,
      username: username,
      password: password,
    };

    connection.query(
      `UPDATE storepassword SET ? WHERE id = ${id}`,
      form_data,
      function (err, result) {
        if (err) {
          req.flash("error", err);
        } else {
          req.flash("success", "Password Details Successfully Modified.");
          res.redirect("/home");
        }
      }
    );
  }
});
//password update end here

//password delete start here
router.get("/delete/(:id)", function (req, res, next) {
  let { id } = req.params;

  connection.query(
    `DELETE FROM storepassword WHERE id = ${id}`,
    function (err, result) {
      if (err) {
        req.flash("error", err);
      } else {
        req.flash("success", "Password Details Successfully Deleted.");
        res.redirect("/home");
      }
    }
  );
});
//password delete end here

//=========================================React Api Start Here========================================================================

//Login Api Start Here
router.post("/checklogin",function(req, res){
  const { email, password } = req.body; 
  console.log(email);
  connection.query(
    "Select * from users where email = ? AND password = ?",
    [email, password],
    function (err, rows, fields) {
      //if (err) throw err;
      // if user not found
      if (err) {
        res.status(401).json(err);
      }
      if (rows) {
        res.status(200).json('Successfull Login');
      }
    }
  );
});

//Login Api End Here

//List Password Api Start
router.get("/home1", function (req, res) {
  connection.query(
    "SELECT * FROM storepassword ORDER BY id desc",
    function (err, rows, fields) {
      if (err) {
        res.status(401).json(err);
      }
      if (rows) {
        res.status(200).json(rows);
      }
    }
  );
});
//List Password Api End

//Save Password Api Start //password add start here
router.post("/addpass2", function (req, res) {
  const { projectName, site_link, username, password } = req.body;
  let errors = false;

  if (!errors) {
    var form_data = {
      projectName,
      site_link,
      username,
      password,
    };

    console.log(form_data);

    connection.query(
      "INSERT INTO storepassword SET ?",
      form_data,
      function (err, rows, fields) {
        if (err) {
          res.status(401).json(err);
        }
        if (rows) {
          res.status(200).json(rows);
        }
      }
    );
  }
});
//Save Password Api End //password add end here

//password details get by id
router.get("/edit1/(:id)", function (req, res) {
  var id = req.params.id;
  connection.query(
    `SELECT * FROM storepassword where id = ${id}`,
    function (err, rows, fields) {
      if (err) throw err;

      if (rows.length <= 0) {
        res
          .status(404)
          .json({ message: "Password Details not found with id = " + id });
      } else {
        res.json(rows[0]);
      }
    }
  );
});
//password details get by id

//Save Password Api Start //password add start here
router.post("/update1", function (req, res) {
  const { projectName, site_link, username, password } = req.body;
  let errors = false;

  if (!errors) {
    var form_data = {
      projectName,
      site_link,
      username,
      password,
    };

    connection.query(
      "INSERT INTO storepassword SET ?",
      form_data,
      function (err, rows, fields) {
        if (err) {
          res.status(401).json(err);
        }
        if (rows) {
          res.status(200).json(rows);
        }
      }
    );
  }
});

router.post("/update1/:id", function (req, res) {
  let { pname, sitelink, username, password } = req.body;
  let id = req.params.id;
  let errors = false;

  if (!errors) {
    var form_data = {
      projectName: pname,
      site_link: sitelink,
      username: username,
      password: password,
    };

    connection.query(
      `UPDATE storepassword SET ? WHERE id = ${id}`,
      form_data,
      function (err, rows, result) {
        if (err) {
          res.status(401).json(err);
        }
        if (rows) {
          res.status(200).json(form_data);
        }
      }
    );
  }
});
//Save Password Api End //password add end here

//password delete start here
router.get("/delete1/(:id)", function (req, res, next) {
  let { id } = req.params;

  connection.query(
    `DELETE FROM storepassword WHERE id = ${id}`,
    function (err, result) {
      if (err) {
        res.status(401).json({ message: "Some thing went Wrong" });
      }
      if (result.affectedRows == 0) {
        res.status(404).json({ message: "ID Not Found" });
      } else {
        res.status(200).json({ message: "Successfully Deleted" });
      }
    }
  );
});
//password delete end here

module.exports = router;
