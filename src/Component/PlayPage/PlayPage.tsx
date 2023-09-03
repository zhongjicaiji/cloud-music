import React, { useEffect } from "react";
import classes from "./PlayPage.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCommentDots,
  faHeart,
  faShareNodes,
} from "@fortawesome/free-solid-svg-icons";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";

import { CurrentSong } from "../../interface/responseInter";
import PlayControl from "./playControl/PlayControl";
import { initSongHandler } from "../../store/reducer/PlaySongSlice";
import axiosInstance from "../../store/Api/apiConfig";

function PlayPage() {
  const currentSong = useSelector(
    (state: any) => state.playSongSlice
  ) as CurrentSong;

  const back = useNavigate();
  const dispatch = useDispatch();

  const param = useParams();
  const local = useLocation();
  useEffect(() => {
    axiosInstance
      .get(`/song/detail?ids=${currentSong.id}`)
      .then((res) => {
        if (res) {
          const data = res.data.songs[0];
          dispatch(
            initSongHandler({
              ...currentSong,
              playState: true,
              name: data.name,
              dTime: data.dt,
              picUrl: data.al.picUrl,
              fee: data.fee,
              artistName: data.ar![0].name,
            })
          );
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [currentSong.id]);

  const backHandler = () => {
    back(local.state.backPath, {
      replace: true,
      state: {
        backPath: local.state.currentPage.backPath,
      },
    });
  };

  return (
    <div className={classes.wrap}>
      <div className={classes.header}>
        <FontAwesomeIcon
          onClick={backHandler}
          className={`${classes.icon}`}
          icon={faArrowLeft}
        />
        <div className={classes.songName}>{currentSong.name}</div>
        <FontAwesomeIcon icon={faShareNodes} />
      </div>
      <div className={classes.dishDrop}>
        <div className={classes.dish}>
          <div className={classes.imgWrap}>
            <img
              className={classes.img}
              src={currentSong.picUrl}
              alt="专辑封面"
            />
          </div>
        </div>
      </div>

      <div className={classes.Context}>
        <div className={classes.songContext}>
          <div className={classes.info}>
            <div className={classes.minSongName}>{currentSong.name}</div>
            <div className={classes.artist}>
              <span className={classes.artistName}>
                {currentSong.artistName}
              </span>
              <span className={classes.interest}>关注</span>
            </div>
          </div>
          <div className={classes.like}>
            <span className={classes.count}>999+</span>
            <FontAwesomeIcon icon={faHeart} />
          </div>

          <div className={classes.comment}>
            <span className={classes.count}>999+</span>
            <FontAwesomeIcon icon={faCommentDots} />
          </div>
        </div>

        <PlayControl />
      </div>
    </div>
  );
}

export default PlayPage;
