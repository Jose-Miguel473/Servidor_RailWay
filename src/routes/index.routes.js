const Router = require("express");

const router = Router();

router.get("/info", ()=>{
    console.log("info")
});

module.exports = router;
