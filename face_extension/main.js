const video = document.createElement('video')
const canvas = document.createElement('canvas')
const canvasCtx = canvas.getContext('2d')
let model = null
let keepAnimation = false

let imageIndex = 0
function getImage() {
  var image = lmMarkImages[0]
  //  imageIndex += 1
  // if (imageIndex == lmMarkImages.length) {
  //   imageIndex = 0
  // }

  return image
}

function drawImage(prediction) {
  let imageIndex = 0
  const boundingBox = prediction.boundingBox
  const x = boundingBox.topLeft[0]
  const y = boundingBox.topLeft[1]
  const w = boundingBox.bottomRight[0] - x
  const h = boundingBox.bottomRight[1] - y

  // draw Rectangle for debug
  // canvasCtx.strokeStyle = "rgb(255, 0, 0)";
  // canvasCtx.strokeRect(x, y, w, h)

  const image = getImage()
  canvasCtx.drawImage(image, x, y, w, h)
}

// //唇
// function drawLips(prediction) {
//   const keypoints = prediction.scaledMesh;

//   // 唇のインデックスを特定（Face Mesh モデルにおけるインデックスは定義済み）
//   const lipsIndices = [78, 191, 80, 81, 82, 13, 311, 310, 415, 308, 324, 318];

//   // 唇の輪郭を求める
//   const lipsContour = lipsIndices.map((index) => keypoints[index]);

//   // 唇の外接矩形を計算
//   let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
//   lipsContour.forEach((point) => {
//     const [x, y] = point;
//     minX = Math.min(minX, x);
//     minY = Math.min(minY, y);
//     maxX = Math.max(maxX, x);
//     maxY = Math.max(maxY, y);
//   });

//   // 唇部分のみを切り取る
//   const lipsWidth = maxX - minX;
//   const lipsHeight = maxY - minY;
//   //const lipsCanvas = document.createElement('canvas');
//   // lipsCanvas.width = lipsWidth;
//   // lipsCanvas.height = lipsHeight;
//   // const lipsCtx = lipsCanvas.getContext('2d');
//   // lipsCtx.drawImage(video, minX, minY, lipsWidth, lipsHeight, 0, 0, lipsWidth, lipsHeight);



//   // Base64 画像を Image オブジェクトに読み込む


//   // 画面に唇画像を描画
//   canvasCtx.drawImage(lmMarkImages[1], minX, minY, lipsWidth, lipsHeight);
// }

async function updateCanvas() {
  if (!keepAnimation) return;

  if (model) {
    canvasCtx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const predictions = await model.estimateFaces({ input: video });
    
    for (const prediction of predictions) {
      drawImage(prediction);
      // drawLips(prediction);
    }
  }
  requestAnimationFrame(updateCanvas);
}


async function updateCanvas() {
  if (!keepAnimation) return

  if (model) {
    //キャンバスをクリア
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height)
 // ビデオを描画する
    canvasCtx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const predictions = await model.estimateFaces({ input: video })
    for (const prediction of predictions) {
      drawImage(prediction)
      //drawLips(prediction); // 修正点: 唇部分を描画する関数を呼び出す
    }
  }
  requestAnimationFrame(updateCanvas)
}

function isScreenSharing(constraints) {
  return !constraints.video.deviceId
}

function replaceStopFunction(stream, videoTrack) {
  if (!videoTrack) return

  videoTrack._stop = videoTrack.stop
  videoTrack.stop = function () {
    keepAnimation = false
    videoTrack._stop()
    stream.getTracks().forEach((track) => {
      track.stop()
    })
  }
}

const _getUserMedia = navigator.mediaDevices.getUserMedia.bind(
  navigator.mediaDevices
)

navigator.mediaDevices.getUserMedia = async function (constraints) {
  const srcStream = await _getUserMedia(constraints)

  if (isScreenSharing(constraints)) {
    return srcStream
  }

  video.srcObject = srcStream
  video.onloadedmetadata = function (e) {
    video.play()
    video.volume = 0.0
    video.width = video.videoWidth
    video.height = video.videoHeight
    canvas.width = video.width
    canvas.height = video.height

    keepAnimation = true
    updateCanvas()
  }

  const outStream = canvas.captureStream(10)
  const videoTrack = outStream.getVideoTracks()[0]
  replaceStopFunction(srcStream, videoTrack)

  return outStream
}

async function loadModel() {
  model = await faceLandmarksDetection.load(
    faceLandmarksDetection.SupportedPackages.mediapipeFacemesh
  )
}


function main() {
  loadModel()
}

main()


//------------------------------------------------

// const video = document.createElement('video');
// const canvas = document.createElement('canvas');
// const canvasCtx = canvas.getContext('2d');
// let model = null;
// let keepAnimation = false;

// let imageIndex = 0;
// function getImage() {
//     var image = lmMarkImages[imageIndex];
//     imageIndex += 1;
//     if (imageIndex == lmMarkImages.length) {
//         imageIndex = 0;
//     }
//     return image;
// }

// function drawImage(prediction, rotationMatrix) {
//     const boundingBox = prediction.boundingBox;
//     const x = boundingBox.topLeft[0];
//     const y = boundingBox.topLeft[1];
//     const w = boundingBox.bottomRight[0] - x;
//     const h = boundingBox.bottomRight[1] - y;
//     const image = getImage();

//     // 回転行列を適用して画像を描画
//     canvasCtx.save();
//     canvasCtx.translate(x + w / 2, y + h / 2);
//     canvasCtx.rotate(Math.atan2(rotationMatrix[3], rotationMatrix[0]));
//     canvasCtx.drawImage(image, -w / 2, -h / 2, w, h);
//     canvasCtx.restore();
// }

// function drawLips(prediction, rotationMatrix) {
//     const keypoints = prediction.scaledMesh;
//     const lipsIndices = [78, 191, 80, 81, 82, 13, 311, 310, 415, 308, 324, 318];
//     const lipsContour = lipsIndices.map((index) => keypoints[index]);
//     let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
//     lipsContour.forEach((point) => {
//         const [x, y] = point;
//         minX = Math.min(minX, x);
//         minY = Math.min(minY, y);
//         maxX = Math.max(maxX, x);
//         maxY = Math.max(maxY, y);
//     });
//     const lipsWidth = maxX - minX;
//     const lipsHeight = maxY - minY;
//     const lipsCenterX = (minX + maxX) / 2;
//     const lipsCenterY = (minY + maxY) / 2;

//     // 唇の中心点を基準に回転行列を適用
//     const rotatedLipsCenter = applyRotationMatrix(
//         [lipsCenterX, lipsCenterY, 0],
//         rotationMatrix
//     );

//     // 回転後の唇の中心点を基準に唇を描画
//     canvasCtx.save();
//     canvasCtx.translate(rotatedLipsCenter[0], rotatedLipsCenter[1]);
//     canvasCtx.rotate(Math.atan2(rotationMatrix[3], rotationMatrix[0]));
//     canvasCtx.drawImage(lmMarkImages[1], -lipsWidth / 2, -lipsHeight / 2, lipsWidth, lipsHeight);
//     canvasCtx.restore();
// }

// // 3次元の点に回転行列を適用する関数
// function applyRotationMatrix(point, rotationMatrix) {
//     const x = point[0];
//     const y = point[1];
//     const z = point[2];

//     const rotatedX = rotationMatrix[0] * x + rotationMatrix[1] * y + rotationMatrix[2] * z;
//     const rotatedY = rotationMatrix[3] * x + rotationMatrix[4] * y + rotationMatrix[5] * z;
//     const rotatedZ = rotationMatrix[6] * x + rotationMatrix[7] * y + rotationMatrix[8] * z;

//     return [rotatedX, rotatedY, rotatedZ];
// }
// async function updateCanvas() {
//     if (!keepAnimation) return;
//     if (model) {
//         canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
//         canvasCtx.drawImage(video, 0, 0, canvas.width, canvas.height);
//         const predictions = await model.estimateFaces({ input: video });
//         for (const prediction of predictions) {
//             const rotationMatrix = calculateRotationMatrix(prediction);
//             drawImage(prediction, rotationMatrix);
//             drawLips(prediction, rotationMatrix);
//             estimateFacePose(prediction);
//         }
//     }
//     requestAnimationFrame(updateCanvas);
// }

// function isScreenSharing(constraints) {
//     return !constraints.video.deviceId;
// }

// function replaceStopFunction(stream, videoTrack) {
//     if (!videoTrack) return;
//     videoTrack._stop = videoTrack.stop;
//     videoTrack.stop = function () {
//         keepAnimation = false;
//         videoTrack._stop();
//         stream.getTracks().forEach((track) => {
//             track.stop();
//         });
//     };
// }

// const _getUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
// navigator.mediaDevices.getUserMedia = async function (constraints) {
//     const srcStream = await _getUserMedia(constraints);
//     if (isScreenSharing(constraints)) {
//         return srcStream;
//     }
//     video.srcObject = srcStream;
//     video.onloadedmetadata = function (e) {
//         video.play();
//         video.volume = 0.0;
//         video.width = video.videoWidth;
//         video.height = video.videoHeight;
//         canvas.width = video.width;
//         canvas.height = video.height;
//         keepAnimation = true;
//         updateCanvas();
//     };
//     const outStream = canvas.captureStream(10);
//     const videoTrack = outStream.getVideoTracks()[0];
//     replaceStopFunction(srcStream, videoTrack);
//     return outStream;
// };

// async function loadModel() {
//     model = await faceLandmarksDetection.load(faceLandmarksDetection.SupportedPackages.mediapipeFacemesh);
// }

// function calculateRotationMatrix(faceLandmarks) {
//   const mesh = faceLandmarks.scaledMesh;
  
//   // 左目と右目の座標を取得
//   const leftEye = mesh[33];
//   const rightEye = mesh[263];
  
//   // 鼻の頂点の座標を取得
//   const noseTip = mesh[1];
  
//   // 左目と右目の中点を計算
//   const eyeCenter = [
//     (leftEye[0] + rightEye[0]) / 2,
//     (leftEye[1] + rightEye[1]) / 2,
//     (leftEye[2] + rightEye[2]) / 2
//   ];
  
//   // 鼻の頂点から目の中点へのベクトルを計算
//   const noseToEyeCenter = [
//     noseTip[0] - eyeCenter[0],
//     noseTip[1] - eyeCenter[1],
//     noseTip[2] - eyeCenter[2]
//   ];
  
//   // ベクトルを正規化
//   const length = Math.sqrt(
//     noseToEyeCenter[0] ** 2 + noseToEyeCenter[1] ** 2 + noseToEyeCenter[2] ** 2
//   );
//   const normalizedNoseToEyeCenter = [
//     noseToEyeCenter[0] / length,
//     noseToEyeCenter[1] / length, 
//     noseToEyeCenter[2] / length
//   ];
  
//   // 上方向のベクトルを計算
//   const upVector = [0, 1, 0];
  
//   // 右方向のベクトルを外積で計算
//   const rightVector = [
//     upVector[1] * normalizedNoseToEyeCenter[2] - upVector[2] * normalizedNoseToEyeCenter[1],
//     upVector[2] * normalizedNoseToEyeCenter[0] - upVector[0] * normalizedNoseToEyeCenter[2],
//     upVector[0] * normalizedNoseToEyeCenter[1] - upVector[1] * normalizedNoseToEyeCenter[0]
//   ];

//   // 回転行列を作成
//   const rotationMatrix = [
//     rightVector[0], upVector[0], normalizedNoseToEyeCenter[0],
//     rightVector[1], upVector[1], normalizedNoseToEyeCenter[1],
//     rightVector[2], upVector[2], normalizedNoseToEyeCenter[2]
//   ];

//   return rotationMatrix;
// }

// function estimateFacePose(faceLandmarks) {
//   const rotationMatrix = calculateRotationMatrix(faceLandmarks);
  
//   // オイラー角を計算
//   const pitch = Math.asin(rotationMatrix[7]);
//   const yaw = Math.atan2(-rotationMatrix[6], rotationMatrix[8]);
//   const roll = Math.atan2(-rotationMatrix[1], rotationMatrix[4]);

//   // ラジアンから度に変換  
//   const pitchDegrees = pitch * 180 / Math.PI;
//   const yawDegrees = yaw * 180 / Math.PI;  
//   const rollDegrees = roll * 180 / Math.PI;

//   console.log(`Pitch: ${pitchDegrees.toFixed(2)}°, Yaw: ${yawDegrees.toFixed(2)}°, Roll: ${rollDegrees.toFixed(2)}°`);
// }

// // ベクトルを正規化する関数
// function normalize(vector) {
//   const length = Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1] + vector[2] * vector[2]);
//   return [vector[0] / length, vector[1] / length, vector[2] / length];
// }

// // ベクトルの減算を行う関数
// function subtract(a, b) {
//   return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
// }

// // ベクトルの外積を計算する関数
// function crossProduct(a, b) {
//   return [
//     a[1] * b[2] - a[2] * b[1],
//     a[2] * b[0] - a[0] * b[2],
//     a[0] * b[1] - a[1] * b[0]
//   ];
// }
// function main() {
//     loadModel();
// }

// main();



// const video = document.createElement('video')
// const canvas = document.createElement('canvas')
// const canvasCtx = canvas.getContext('2d')
// let model = null
// let keepAnimation = false

// let imageIndex = 0
// function getImage() {
//   var image = lmMarkImages[imageIndex]
//    imageIndex += 1
//   if (imageIndex == lmMarkImages.length) {
//     imageIndex = 0
//   }

//   return image
// }

// function drawImage(prediction, rotationMatrix) {
//   let imageIndex = 0
//   const boundingBox = prediction.boundingBox
//   const x = boundingBox.topLeft[0]
//   const y = boundingBox.topLeft[1]
//   const w = boundingBox.bottomRight[0] - x
//   const h = boundingBox.bottomRight[1] - y

//   const image = getImage()

//   // 回転行列を適用して画像を描画
//   canvasCtx.save()
//   canvasCtx.translate(x + w / 2, y + h / 2)
//   canvasCtx.rotate(-Math.atan2(rotationMatrix[3], rotationMatrix[0])) // 回転角度を反転
//   canvasCtx.scale(1, -1) // 上下反転を適用
//   canvasCtx.drawImage(image, -w / 2, -h / 2, w, h)
//   canvasCtx.restore()
// }

// //唇
// function drawLips(prediction, rotationMatrix) {
//   const keypoints = prediction.scaledMesh

//   // 唇のインデックスを特定（Face Mesh モデルにおけるインデックスは定義済み）
//   const lipsIndices = [78, 191, 80, 81, 82, 13, 311, 310, 415, 308, 324, 318]

//   // 唇の輪郭を求める
//   const lipsContour = lipsIndices.map((index) => keypoints[index])

//   // 唇の外接矩形を計算
//   let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
//   lipsContour.forEach((point) => {
//     const [x, y] = point
//     minX = Math.min(minX, x)
//     minY = Math.min(minY, y)
//     maxX = Math.max(maxX, x)
//     maxY = Math.max(maxY, y)
//   })

//   // 唇部分のみを切り取る
//   const lipsWidth = maxX - minX
//   const lipsHeight = maxY - minY
//   const lipsCenterX = (minX + maxX) / 2
//   const lipsCenterY = (minY + maxY) / 2

//   // 唇の中心点を基準に回転行列を適用
//   const rotatedLipsCenter = applyRotationMatrix(
//     [lipsCenterX, lipsCenterY, 0],
//     rotationMatrix
//   )

//   // 回転後の唇の中心点を基準に唇を描画
//   canvasCtx.save()
//   canvasCtx.translate(rotatedLipsCenter[0], rotatedLipsCenter[1])
//   canvasCtx.rotate(-Math.atan2(rotationMatrix[3], rotationMatrix[0])) // 回転角度を反転
//   canvasCtx.scale(1, -1) // 上下反転を適用
//   canvasCtx.drawImage(lmMarkImages[1], -lipsWidth / 2, -lipsHeight / 2, lipsWidth, lipsHeight)
//   canvasCtx.restore()
// }

// async function updateCanvas() {
//   if (!keepAnimation) return

//   if (model) {
//     //キャンバスをクリア
//     canvasCtx.clearRect(0, 0, canvas.width, canvas.height)
//     // ビデオを描画する
//     canvasCtx.drawImage(video, 0, 0, canvas.width, canvas.height)

//     const predictions = await model.estimateFaces({ input: video })
//     for (const prediction of predictions) {
//       const rotationMatrix = calculateRotationMatrix(prediction)
//       drawImage(prediction, rotationMatrix)
//       drawLips(prediction, rotationMatrix)
//     }
//   }
//   requestAnimationFrame(updateCanvas)
// }

// function isScreenSharing(constraints) {
//   return !constraints.video.deviceId
// }

// function replaceStopFunction(stream, videoTrack) {
//   if (!videoTrack) return

//   videoTrack._stop = videoTrack.stop
//   videoTrack.stop = function () {
//     keepAnimation = false
//     videoTrack._stop()
//     stream.getTracks().forEach((track) => {
//       track.stop()
//     })
//   }
// }

// const _getUserMedia = navigator.mediaDevices.getUserMedia.bind(
//   navigator.mediaDevices
// )

// navigator.mediaDevices.getUserMedia = async function (constraints) {
//   const srcStream = await _getUserMedia(constraints)

//   if (isScreenSharing(constraints)) {
//     return srcStream
//   }

//   video.srcObject = srcStream
//   video.onloadedmetadata = function (e) {
//     video.play()
//     video.volume = 0.0
//     video.width = video.videoWidth
//     video.height = video.videoHeight
//     canvas.width = video.width
//     canvas.height = video.height

//     keepAnimation = true
//     updateCanvas()
//   }

//   const outStream = canvas.captureStream(10)
//   const videoTrack = outStream.getVideoTracks()[0]
//   replaceStopFunction(srcStream, videoTrack)

//   return outStream
// }

// async function loadModel() {
//   model = await faceLandmarksDetection.load(
//     faceLandmarksDetection.SupportedPackages.mediapipeFacemesh
//   )
// }

// function calculateRotationMatrix(faceLandmarks) {
//   const mesh = faceLandmarks.scaledMesh

//   // 左目と右目の座標を取得
//   const leftEye = mesh[33]
//   const rightEye = mesh[263]

//   // 鼻の頂点の座標を取得
//   const noseTip = mesh[1]

//   // 左目と右目の中点を計算
//   const eyeCenter = [
//     (leftEye[0] + rightEye[0]) / 2,
//     (leftEye[1] + rightEye[1]) / 2,
//     (leftEye[2] + rightEye[2]) / 2
//   ]

//   // 鼻の頂点から目の中点へのベクトルを計算
//   const noseToEyeCenter = [
//     noseTip[0] - eyeCenter[0],
//     noseTip[1] - eyeCenter[1],
//     noseTip[2] - eyeCenter[2]
//   ]

//   // ベクトルを正規化
//   const length = Math.sqrt(
//     noseToEyeCenter[0] ** 2 + noseToEyeCenter[1] ** 2 + noseToEyeCenter[2] ** 2
//   )
//   const normalizedNoseToEyeCenter = [
//     noseToEyeCenter[0] / length,
//     noseToEyeCenter[1] / length,
//     noseToEyeCenter[2] / length
//   ]

//   // 上方向のベクトルを計算
//   const upVector = [0, 1, 0]

//   // 右方向のベクトルを外積で計算
//   const rightVector = [
//     upVector[1] * normalizedNoseToEyeCenter[2] - upVector[2] * normalizedNoseToEyeCenter[1],
//     upVector[2] * normalizedNoseToEyeCenter[0] - upVector[0] * normalizedNoseToEyeCenter[2],
//     upVector[0] * normalizedNoseToEyeCenter[1] - upVector[1] * normalizedNoseToEyeCenter[0]
//   ]

//   // 回転行列を作成
//   const rotationMatrix = [
//     rightVector[0], upVector[0], normalizedNoseToEyeCenter[0],
//     rightVector[1], upVector[1], normalizedNoseToEyeCenter[1],
//     rightVector[2], upVector[2], normalizedNoseToEyeCenter[2]
//   ]

//   return rotationMatrix
// }

// // 3次元の点に回転行列を適用する関数
// function applyRotationMatrix(point, rotationMatrix) {
//   const x = point[0]
//   const y = point[1]
//   const z = point[2]

//   const rotatedX = rotationMatrix[0] * x + rotationMatrix[1] * y + rotationMatrix[2] * z
//   const rotatedY = rotationMatrix[3] * x + rotationMatrix[4] * y + rotationMatrix[5] * z
//   const rotatedZ = rotationMatrix[6] * x + rotationMatrix[7] * y + rotationMatrix[8] * z

//   return [rotatedX, rotatedY, rotatedZ]
// }

// function main() {
//   loadModel()
// }

// main()

// const video = document.createElement('video')
// const canvas = document.createElement('canvas')
// const canvasCtx = canvas.getContext('2d')
// let model = null
// let keepAnimation = false

// let imageIndex = 0
// function getImage() {
//   var image = lmMarkImages[imageIndex]
//   imageIndex += 1
//   if (imageIndex == lmMarkImages.length) {
//     imageIndex = 0
//   }

//   return image
// }

// function drawImage(prediction) {
//   let imageIndex = 0
//   const boundingBox = prediction.boundingBox
//   const x = boundingBox.topLeft[0]
//   const y = boundingBox.topLeft[1]
//   const w = boundingBox.bottomRight[0] - x
//   const h = boundingBox.bottomRight[1] - y

//   const image = getImage()
//   canvasCtx.save(); // Save the current canvas state
//   // Calculate the center of the face bounding box
//   const centerX = x + w / 2;
//   const centerY = y + h / 2;
//   // Translate and rotate the canvas context to match the face tilt
//   canvasCtx.translate(centerX, centerY);
//   const angle = Math.atan2(prediction.annotations.leftEyeLower0[1] - prediction.annotations.rightEyeLower0[1], prediction.annotations.leftEyeLower0[0] - prediction.annotations.rightEyeLower0[0]);
//   canvasCtx.rotate(angle);
//   // Draw the image with the rotated context
//   canvasCtx.drawImage(image, -w / 2, -h / 2, w, h);
//   canvasCtx.restore(); // Restore the canvas state to undo the translation and rotation
// }

// async function updateCanvas() {
//   if (!keepAnimation) return

//   if (model) {
//     canvasCtx.clearRect(0, 0, canvas.width, canvas.height)
//     canvasCtx.drawImage(video, 0, 0, canvas.width, canvas.height);

//     const predictions = await model.estimateFaces({ input: video })
//     for (const prediction of predictions) {
//       drawImage(prediction)
//     }
//   }
//   requestAnimationFrame(updateCanvas)
// }

// function isScreenSharing(constraints) {
//   return !constraints.video.deviceId
// }

// function replaceStopFunction(stream, videoTrack) {
//   if (!videoTrack) return

//   videoTrack._stop = videoTrack.stop
//   videoTrack.stop = function () {
//     keepAnimation = false
//     videoTrack._stop()
//     stream.getTracks().forEach((track) => {
//       track.stop()
//     })
//   }
// }

// const _getUserMedia = navigator.mediaDevices.getUserMedia.bind(
//   navigator.mediaDevices
// )

// navigator.mediaDevices.getUserMedia = async function (constraints) {
//   const srcStream = await _getUserMedia(constraints)

//   if (isScreenSharing(constraints)) {
//     return srcStream
//   }

//   video.srcObject = srcStream
//   video.onloadedmetadata = function (e) {
//     video.play()
//     video.volume = 0.0
//     video.width = video.videoWidth
//     video.height = video.videoHeight
//     canvas.width = video.width
//     canvas.height = video.height

//     keepAnimation = true
//     updateCanvas()
//   }

//   const outStream = canvas.captureStream(10)
//   const videoTrack = outStream.getVideoTracks()[0]
//   replaceStopFunction(srcStream, videoTrack)

//   return outStream
// }

// async function loadModel() {
//   model = await faceLandmarksDetection.load(
//     faceLandmarksDetection.SupportedPackages.mediapipeFacemesh
//   )
// }

// function main() {
//   loadModel()
// }

// main()
