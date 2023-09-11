// date settings
function isoDayOfWeek(dt) {
  let wd = dt.getDay(); // 0-6(日-土)を取得し、wdに代入
  wd = ((wd + 6) % 7) + 1; // 1-7(月-日)に変換
  return '' + wd; // wd(数値)を文字列として返すために ''と連結する
}

// setup date 365 days // squares
function generateData() {
  const d = new Date(); // 現在の日付と時刻を生成
  const today = new Date( // 現在の年,月,日,時間,分,秒,ミリ秒の情報を取得 (時間,分,秒,ミリ秒は0で設定)
    d.getFullYear(),
    d.getMonth(),
    d.getDate(),
    0,
    0,
    0,
    0
  );
  const data2 = [];
  const end = today;
  let dt = new Date(new Date().setDate(end.getDate() - 365)); // 現在の日付から365日前(1年前)の日付を求めている
  while (dt <= end) {
    const iso = dt.toISOString().substr(0, 10); //　dtの最初の10文字(年,月,日)を文字列で取得
    data2.push({
      x: iso,
      y: isoDayOfWeek(dt),
      d: iso,
      v: Math.random() * 50, // 最大50。この数値が大きいほど、ヒートマップの色が暗くなる
    });
    dt = new Date(dt.setDate(dt.getDate() + 1)); // stを1日進めて、次の日付に移動
  }
  console.log(data2);
  return data2;
}
// ヒートマップのデータセットとその外観設定
const data = {
  datasets: [
    {
      label: 'Heat Map',
      data: generateData(), // ヒートマップデータを生成する関数、generateData() の結果を使用
      backgroundColor(c) {
        const value = c.dataset.data[c.dataIndex].v;
        const alpha = (10 + value) / 60; // 透明度の値を計算
        return `rgba(0, 200, 0, ${alpha})`; // セルの背景色を設定
      },
      borderColor: 'green', // 境界線の色
      borderRadius: 1, // 境界線の丸角度
      borderWidth: 1, // 境界線の幅
      hoverBackgroundColor: 'rgba(255, 26, 104, 0.2)', //　ホバー時の背景色 (赤色)
      hoverBorderColor: 'rgba(255, 26, 104, 0.2)', // ホバー時の境界の色(赤色)
      width(c) {
        const a = c.chart.chartArea || {};
        return (a.right - a.left) / 53 - 1; // ヒートマップのセルの幅を計算 (53: 1年あたりの週数)
      },
      height(c) {
        const a = c.chart.chartArea || {};
        return (a.bottom - a.top) / 7 - 1; // ヒートマップのセルの高さを計算。 (7: 1週間あたりの日数)
      },
    },
  ],
};

// scales block
const scales = {
  y: {
    type: 'time',
    offset: true,
    time: {
      unit: 'day',
      round: 'day',
      isoWeek: 1,
      parser: 'i',
      displayFormats: {
        day: 'iiiiii', //　縦軸の表記を曜日で表示 (i～ii:数字, iii～iiiiii:英語)
      },
    },
    reverse: true,
    position: 'right',
    ticks: {
      maxRotation: 0,
      autoSkip: true,
      padding: 1,
      font: {
        size: 9, // y軸のフォントサイズ
      },
    },
    grid: {
      display: false, // grid横線が消える
      drawBorder: false, // 軸線
      tickLength: 0, // 目盛線の長さ
    },
  },
  x: {
    type: 'time',
    position: 'bottom',
    offset: true,
    time: {
      unit: 'week',
      round: 'week',
      isoWeekDay: 1,
      displayFormats: {
        week: 'MMM dd',
      },
    },
    ticks: {
      maxRotation: 0,
      autoSkip: true,
      font: {
        size: 9, // x軸のフォントサイズ
      },
    },
    grid: {
      display: false, // grid縦線が消える
      drawBorder: false,
      tickLength: 0,
    },
  },
};

// config
const config = {
  type: 'matrix',
  data,
  options: {
    maintainAspectRatio: false /* ← chartの形状を保つために追加したコード */,
    scales: scales,
    plugins: {
      legend: {
        display: false, // 表題の表示をオフ
      },
    },
  },
};

// render init block
const myChart = new Chart(document.getElementById('myChart'), config);
// Instantly assign Chart.js version
const chartVersion = document.getElementById('chartVersion');
chartVersion.innerText = Chart.version;
