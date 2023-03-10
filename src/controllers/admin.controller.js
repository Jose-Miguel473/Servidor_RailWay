const { response } = require("express");
const Admin = require("../models/Admin.model");

const getAdmin = async (req, res = response) => {
  try {
    const admin = await Admin.find();
    // const Admin = await Admin.find().populate("Admin", "nameUser")
    const adminInfo = []
    admin.map((adm) => {
        adminInfo.push(adm)
      console.log(adminInfo);
    })
    return res.status(200).json({
      transaction: true,
      code: 0, // Respuesta Existosa
      adminInfo,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      transaction: false,
      code: -2, // Excepcion no controllada
      msg: "Excepcion No Controlada, por favor informe al administrador.",
    });
  }
};

const registerAdmin = async (req, res = response) => {
  const { email } = req.body;
  try {
    let admin = await Admin.findOne({ email });
    if (admin) {
      return res.status(200).json({
        transaction: false,
        code: 2, // Registro existente
        msg: "El email ya se encuentra registrando.",
      });
    }
    admin = new Admin(req.body);

    await admin.save();

    return res.status(201).json({
      transaction: true,
      code: 1, // La peticion fue correcta
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      transaction: false,
      code: -2, // Excepcion no controllada
      msg: "Excepcion No Controlada, por favor informe al administrador.",
    });
  }
};

const updateAdmin = async (req, res = response) => {
  const { email, verification } = req.body;
  
  try {
    let admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({
        transaction: false,
        code: 0, // Registro existente
        msg: "El email NO se encuentra registrando.",
      });
    }

    const newAdmin = {
      verification
    };

    const adminUpdated = await Admin.findOneAndUpdate(
      {email},
      newAdmin,
      { new: true }
    );

    return res.json({
      transaction: true,
      code: 3,
      msg: "Estado de correo electronico actualizado"
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      transaction: false,
      code: -2, // Excepcion no controllada
      msg: "Excepcion No Controlada, por favor informe al administrador.",
    });
  }
};

module.exports = {
  getAdmin,
  registerAdmin,
  updateAdmin
};
