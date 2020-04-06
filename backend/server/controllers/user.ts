import * as jwt from "jsonwebtoken";

import User from "../models/user";
import BaseCtrl from "./base";
import PoolCtrl from "../controllers/pool";

export default class UserCtrl extends BaseCtrl {
  model = User;

  login = (req: any, res: any) => {
    this.model.findOne(
      { nickname: req.body.nickname },
      (err: any, user: any) => {
        if (!user) return res.sendStatus(403);
        const token = jwt.sign({ user }, "catswillruletheworld"); // , { expiresIn: 10 } seconds
        res.status(200).json({ token });
      }
    );
  };

  vote = async function(req: any, res: any) {
    let {
      code: _code,
      greenMarbles: _greenM,
      redMarbles: _redM,
      nickname: user
    } = req.body;
    const _poolCtrl = new PoolCtrl();
    let out: any = await _poolCtrl.updatePool(_code, _greenM, _redM, user);
    res.status(200).json(out);
  };
}
