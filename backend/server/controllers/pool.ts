// import Cat from '../models/cat';
// import BaseCtrl from './base';

// export default class CatCtrl extends BaseCtrl {
//   model = Cat;
// }
import Pool from "../models/pool";
import BaseCtrl from "./base";
import * as bcrypt from "bcryptjs";

export default class poolCtrl extends BaseCtrl {
  model = Pool;

  newPool = function(req: any, res: any) {
    let { totalPeople: _totalPpl, marbles: _marbles } = req.body;

    bcrypt.genSalt(5, function(err: any, salt: any) {
      if (err) res.json(err);
      bcrypt.hash(Date(), salt, function(err: any, hash: any) {
        if (err) return res.json(err);
        else {
          const date = new Date(Date());
          console.log(date.toDateString());

          const nwPool = new Pool();
          nwPool.code = hash.substring(7, 12);
          nwPool.date = date.toLocaleDateString("es-ES", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
          });
          nwPool.totalPeople = _totalPpl;
          nwPool.marbles = _marbles;
          nwPool
            .save()
            .then(function() {
              res.json("pool created!");
            })
            .catch((err: any) => {
              console.error(err);
            });
        }
      });
    });
  };

  showPool = async (req: any, res: any) => {
    let { date: date, code: code } = req.body;
    try {
      let qry: any = {};
      if (date) qry.date = date;
      else qry.code = code;

      let rslt = await this.model.findOne(qry);
      // Returna solo los resultados
      res.status(200).json(rslt.results);
    } catch (_err) {
      res.status(403).json(_err);
    }
  };

  updatePool = async function(code: any, _greenM: any, _redM: any, user: any) {
    let response: Object;
    var veVoted = 0;
    try {
      await this.model.findOne({ code: code }).then(async rslt => {
        if (!rslt) response = { message: "La sesion no existe" };
        if (rslt.results.length !== 0) {
          rslt.results.forEach((obj: any) => {
            if (obj.user == user) {
              response = { message: "El usuario ya ha realizado su voto" };
              veVoted = 1;
            }
          });
          if (veVoted == 0) {
            rslt.results.push({
              user: user,
              redMarbles: _redM,
              greenMarbles: _greenM
            });
            await rslt
              .save()
              .then((_res: Object) => {
                if (!_res) response = { message: "no hay resultados" };
                response = _res;
              })
              .catch((err: any) => {
                console.log(err);
              });
          }
        } else {
          rslt.results.push({
            user: user,
            redMarbles: _redM,
            greenMarbles: _greenM
          });
          await rslt.save().then((_res: Object) => {
            if (!_res) response = { message: "no hay resultados" };
            response = _res;
          });
        }
      });
    } catch (_err) {
      if (_err) return { error: _err };
    }
    return response;
  };
}
