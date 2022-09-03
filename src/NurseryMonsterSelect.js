import React, { useEffect, useState } from "react";
import MoonLoader from "react-spinners/MoonLoader";
import { motion } from "framer-motion";
import MonsterABI from "../src/api/Monsters.json";
import { ethers } from "ethers";
import ReactDOM from "react-dom";

const MonsterContract = "0x90B9aCC7C0601224310f3aFCaa451c0D545a1b41";

const NurseryMonsterSelect = ({
  showSelectMonster,
  setShowSelectMonster,
  monsterSelected,
  setMonsterSelected,
}) => {
  const [monsters, setMonsters] = useState([]);
  const [loadingMonster, setLoadingMonster] = useState(false);
  const [duration, setDuration] = useState([]);
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const monsterContract = new ethers.Contract(
    MonsterContract,
    MonsterABI.abi,
    signer
  );

  async function getMonsters() {
    let monstersTemp = [];
    let durations = [];
    setLoadingMonster(true);
    const myMonsters = await monsterContract.getMyMonster(signer.getAddress());
    for (let i = 0; i < myMonsters.length; i++) {
      const status = await monsterContract.getMonsterStatus(myMonsters[i]);
      durations.push(1);
      if (status.toString() === "0") {
        monstersTemp.push(myMonsters[i]);
      }
    }
    setDuration(durations);
    setMonsters(monstersTemp);
    setLoadingMonster(false);
  }

  function checkSelectedMonsters(monster) {
    let result = true;
    if (monsterSelected.length < 1) {
      setMonsterSelected((currentSelected) => [...currentSelected, monster]);
    } else {
      for (let i = 0; i < monsterSelected.length; i++) {
        if (monster === monsterSelected[i]) {
          result = false;
        }
      }
      return result;
    }
    console.log(monsterSelected);
  }

  function selectMonster(index) {
    if (monsterSelected.length >= 6) return;
    let monster = monsters[index];
    let result = checkSelectedMonsters(monster.toString());
    if (!result) return;
    setMonsterSelected((currentSelected) => [
      ...currentSelected,
      monster.toString(),
    ]);
  }

  function deselectMonster(index) {
    let monster = monsterSelected[index];
    setMonsterSelected((currentSelected) =>
      currentSelected.filter((monsterSelected) => monsterSelected !== monster)
    );
  }

  useEffect(() => {
    getMonsters();
  }, []);

  if (!showSelectMonster) return;
  return (
    <>
      <motion.div
        id="shop-modal"
        className="container w-75 h-75"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ type: "tween", duration: 0.25 }}
      >
        <div className="container-fluid">
          <div className="col-2">
            <img
              src="back_icon.png"
              alt="back-icon"
              width={"14%"}
              onClick={() => setShowSelectMonster(false)}
            />
          </div>
          <div className="row justify-content-center align-items-start">
            <div className="col-8">
              <h4 className="text-center p-3" id="modal-title">
                Select Your Monsters
              </h4>
              <div
                id="monsters-container"
                className="d-flex justify-content-center flex-wrap"
              >
                {loadingMonster ? (
                  <MoonLoader size={50} loading={loadingMonster} />
                ) : monsters.length < 1 ? (
                  <h5 className="text-center" id="modal-title">
                    No monster on Inventory
                  </h5>
                ) : (
                  monsters.map((monster, index) => (
                    <div
                      className="card col-3 m-2 text-center d-flex justify-content-center align-items-center"
                      key={index}
                      style={{ backgroundColor: "#D8CCA3" }}
                      onClick={() => selectMonster(index)}
                    >
                      <img src="/monster.png" width={"50%"} alt="monster-img" />
                      <div className="card-body py-1 text-center">
                        <h5 className="card-title text-center" id="modal-title">
                          Monster #{monster.toString()}
                        </h5>
                        <div className="d-flex justify-content-center">
                          <button className="btn btn-danger col">-</button>
                          <input
                            type="text"
                            className="form-control text-center col"
                            value={duration[index]}
                            name={index}
                          />
                          <button className="btn btn-success col">+</button>
                        </div>

                        <button
                          id="modal-title"
                          className="btn btn-success m-3"
                        >
                          Send
                        </button>
                      </div>
                    </div>
                  ))
                )}
                <div className="col-4 m-2" />
              </div>
            </div>
            <div className="col">
              <div className="row justify-content-center align-items-center">
                <h4 className="p-3 text-center" id="modal-title">
                  {monsterSelected.length} Monster Selected
                </h4>
              </div>
              <div className="row flex-column justify-content-start align-items-center">
                {monsterSelected.map((monster, index) => (
                  <div
                    key={index}
                    className="p-2 my-2 text-cnter d-flex justify-content-center align-items-start"
                  >
                    <button
                      className="btn btn-danger rounded-circle"
                      onClick={() => deselectMonster(index)}
                    >
                      X
                    </button>
                    <div
                      className="p-2 my-2 text-cnter d-flex justify-content-center align-items-center"
                      style={{
                        backgroundColor: "#D8CCA3",
                        width: "4rem",
                        height: "4rem",
                      }}
                    >
                      {monsterSelected[0] !== undefined ? (
                        monster
                      ) : (
                        <h6> + </h6>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default NurseryMonsterSelect;
