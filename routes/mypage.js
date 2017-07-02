const mysql = require('mysql');
const pool = require('../config/db_pool');
const express = require('express');
const router = express.Router();
const async = require('async');
const jwtModule = require('../models/jwtModule');


/*
 * 모댈 마이 페이지
 * request params :
 * member_token
 */
router.get('/modelMypage', function(req, res) {
    var resultModelJson = {
        message: 'ok',
        modelInfo: {},
        modelPhoto1: '',
        modelPhoto2: '',
        modelPhoto3: '',
        modelPickList: [],
    };
    var decoded = jwtModule.decodeToken(req.headers.member_token);
    var select_model_mypage_task = [
        //1. connection 가져오기
        function(callback) {
            pool.getConnection(function(err, connection) {
                if (err) {
                    console.log("getConnection error : ", err);
                    callback(err, connection, null);
                } else callback(null, connection);
            });
        },
        // 모델에 관한 정보들
        function(connection, callback) {

            let select_model_mypage_query =
                "select * from Member where member_id = ?";
            connection.query(select_model_mypage_query, decoded.memberId, function(err, data) {
                if (err) {
                    console.log("select_model_mypage_query query error : ", err);
                    callback(err, connection, null);
                } else {
                    if (data.length !== 0) {
                        resultModelJson.modelInfo.memberName =  data[0].member_name;
                        resultModelJson.modelInfo.memberPhoto =data[0].member_photo;

                        //   res.status(200).send(resultModelJson);
                        callback(null, connection);
                    }
                }
            });
        },
        //모델 현재 머리상태1
        function(connection, callback) {
            // let decoded = jwtModule.decodeToken(req.headers.member_token);
            let model_photo1_query = "select * from model_hair_imgs where member_id  = ? and  photo_type = 'hairCondition1' ";
            connection.query(model_photo1_query, decoded.memberId, function(err, data) {
                if (err) {
                    console.log("model_photo1_query error : ", err);
                    callback(err, connection, null);
                } else {
                    if (!data.length == 0) {
                        resultModelJson.modelPhoto1 = data[0].member_photo;

                    }
        //  res.status(200).send(resultModelJson);
                  callback(null, connection);
                }
            });
        },
        //모델 현재 머리상태2
        function(connection, callback) {
            // let decoded = jwtModule.decodeToken(req.headers.member_token);
            let model_photo2_query = "select * from model_hair_imgs where member_id  = ? and  photo_type = 'hairCondition2' ";
            connection.query(model_photo2_query, decoded.memberId, function(err, data) {
                if (err) {
                    console.log("model_photo2_query error : ", err);
                    callback(err, connection, null);
                } else {
                    if (!data.length == 0) {
                        resultModelJson.modelPhoto2 = data[0].member_photo;

                    }

                  callback(null, connection);
                }
            });
        },
        //모델 현재 머리상태3
        function(connection, callback) {
            // let decoded = jwtModule.decodeToken(req.headers.member_token);
            let model_photo3_query = "select * from model_hair_imgs where member_id  = ? and  photo_type = 'hairCondition3' ";
            connection.query(model_photo3_query, decoded.memberId, function(err, data) {
                if (err) {
                    console.log("model_photo3_query error : ", err);
                    callback(err, connection, null);
                } else {
                    if (!data.length == 0) {
                        resultModelJson.modelPhoto3 = data[0].member_photo;

                    }
        //  res.status(200).send(resultModelJson);
                  callback(null, connection);
                }
            });
        },
        //4. 모델이 찜한 목록
        function(connection, callback) {
            //let decoded = jwtModule.decodeToken(req.headers.member_token);
            let mobel_pick_list_query = "select * from model_pick_list where picker_id = ? order by written_time desc;"
            connection.query(mobel_pick_list_query, decoded.memberId, function(err, data) {
                if (err) {
                    console.log("mobel_pick_list_query query error : ", err);
                    callback(err, connection, null);
                } else {
                    if (data.length !== 0) {
                        for (var x in data) {
                            var pickList = {}
                            pickList.postId = data[x].post_id
                            pickList.postImg = data[x].notice_photo;
                            pickList.title = data[x].title;
                            pickList.place = data[x].sigugun;
                            resultModelJson.modelPickList.push(pickList);
                        }

                    }
                    res.status(200).send(resultModelJson);
                    callback(null, connection);
                }
            });
        },
        //5. connection release
        function(connection, callback) {
            connection.release();
            callback(null, null, '-postDetail');
        }
    ];

    async.waterfall(select_model_mypage_task, function(err, connection, result) {
        if (connection) {
            connection.release();
        }

        if (err) {
            if (err != 'ok') {
                console.log("async.waterfall error : ", err);
                res.status(503).send({
                    message: 'failure',
                    detail: 'internal server error'
                });
            }
        } else {
            console.log(result);
        }
    });
});


/*
 * 디자이너 마이 페이지
 * request params :
 * member_token
 */
router.get('/designerMypage', function(req, res) {
    var resultJson = {
        message: 'ok',
        designerInfo: {},
        designerPostList: [],
        desingerPFPhoto: [],

        designerCommetPostList: []

    };
    var decoded = jwtModule.decodeToken(req.headers.member_token);
    var select_designer_mypage_task = [
        //1. connection 가져오기
        function(callback) {
            pool.getConnection(function(err, connection) {
                if (err) {
                    console.log("getConnection error : ", err);
                    callback(err, connection, null);
                } else callback(null, connection);
            });
        },
        //3. 디자이너에 관한 정보들
        function(connection, callback) {

            let select_designer_mypage_query =
                "select * from designer_mypage where member_id = ?";
            connection.query(select_designer_mypage_query, decoded.memberId, function(err, data) {
                if (err) {
                    console.log("select_designer_mypage_query query error : ", err);
                    callback(err, connection, null);
                } else {
                    if (data.length !== 0) {
                        resultJson.designerInfo.memberPhoto = data[0].member_photo;
                        resultJson.designerInfo.ststusMsg = data[0].status_msg;
                        resultJson.designerInfo.memberName = data[0].member_name;
                        resultJson.designerInfo.agvScore = data[0]['avg(score)'];
                        resultJson.designerMsg = data[0].status_msg;
                        //    res.status(200).send(resultJson);
                        callback(null, connection);
                    }
                }
            });
        },
        //4. 디자이너 글 목록
        function(connection, callback) {
            // let decoded = jwtModule.decodeToken(req.headers.member_token);
            let designer_post_list_query = "select * from designer_mypage_post_list where writer_id = ? order by written_time desc"
            connection.query(designer_post_list_query, decoded.memberId, function(err, data) {
                if (err) {
                    console.log("designer_post_list_query error : ", err);
                    callback(err, connection, null);
                } else {
                    if (!data.length == 0) {

                        for (var x in data) {
                            var PostListData = {}
                            PostListData.postId = data[x].post_id;
                            PostListData.noticePhoto = data[x].notice_photo;
                            PostListData.servicePlace = data[x].sigugun;
                            PostListData.postTitle = data[x].title;
                            resultJson.designerPostList.push(PostListData);
                            //      res.status(200).send(resultJson);
                        }

                        callback(null, connection);
                    }



                }
            });
        },
        //4. 디자이너 포트폴리오 사진
        function(connection, callback) {
            //let decoded = jwtModule.decodeToken(req.headers.member_token);
            let designer_photo_list_query = "select * from designer_portfolio_imgs where member_id = ? order by reg_time desc;"
            connection.query(designer_photo_list_query, decoded.memberId, function(err, data) {
                if (err) {
                    console.log("designer_photo_list_query query error : ", err);
                    callback(err, connection, null);
                } else {
                    if (data.length !== 0) {
                        for (var x in data) {
                            var photoList = {}
                            photoList.PFPhoto = data[x].member_photo;
                            resultJson.desingerPFPhoto.push(photoList);
                        }
                    }

                    callback(null, connection);
                }
            });
        },
        //디자이너 후기 목록
        function(connection, callback) {
            // let decoded = jwtModule.decodeToken(req.headers.member_token);
            let designer_comment_list_query = "select * from designer_comment_list where designer_id  = ? order by written_time desc;"
            connection.query(designer_comment_list_query, decoded.memberId, function(err, data) {
                if (err) {
                    console.log("designer_comment_list_query query error : ", err);
                    callback(err, connection, null);
                } else {
                    if (data.length !== 0) {
                        for (var x in data) {
                            var commetList = {}

                            commetList.writerName = data[x].member_name;
                            commetList.title = data[x].title;
                            commetList.content = data[x].content;
                            commetList.commentPhoto = data[x].comment_photo;
                            commetList.score = data[x].score;
                            resultJson.designerCommetPostList.push(commetList);
                        }
                    }
                    res.status(200).send(resultJson);
                    callback(null, connection);
                }

            });
        },

        //5. connection release
        function(connection, callback) {
            connection.release();
            callback(null, null, '-postDetail');
        }
    ];

    async.waterfall(select_designer_mypage_task, function(err, connection, result) {
        if (connection) {
            connection.release();
        }

        if (err) {
            if (err != 'ok') {
                console.log("async.waterfall error : ", err);
                res.status(503).send({
                    message: 'failure',
                    detail: 'internal server error'
                });
            }
        } else {
            console.log(result);
        }
    });
});




/*
 * 디자이너 한마디 등록
 * request params :
 * member_token
 */
router.post('/statusMsg', function(req, res) {

    var decoded = jwtModule.decodeToken(req.headers.member_token);

    var update_model_ststusMsg_task = [
            //1. connection 가져오기
            function(callback) {
                pool.getConnection(function(err, connection) {
                    if (err) {
                        console.log("getConnection error : ", err);
                        callback(err, connection, null);
                    } else callback(null, connection);
                });
            },
            // 상태 메세지 update
            function(connection,callback) {
              let update_model_ststusMsg_query =
              "update  Member "+
              " set  status_msg =? "+
              "where member_id= ?";
              let record = [
                req.body.statusMsg,
                  decoded.memberId
              ];
              connection.query(update_model_ststusMsg_query, record, function(err, data) {
                if(err) {
                  console.log("insert query error : ", err);
                  callback(err, connection, null);
                }
                else{
                  res.status(201).send({
                      message: 'ok'
                  });
                  callback(null, connection);
                }
              });
            },


        //5. connection release
        function(connection, callback) {
            connection.release();
            callback(null, null, '-postDetail');
        }
];

async.waterfall(update_model_ststusMsg_task, function(err, connection, result) {
    if (connection) {
        connection.release();
    }

    if (err) {
        if (err != 'ok') {
            console.log("async.waterfall error : ", err);
            res.status(503).send({
                message: 'failure',
                detail: 'internal server error'
            });
        }
    } else {
        console.log(result);
    }
});
});



module.exports = router;
