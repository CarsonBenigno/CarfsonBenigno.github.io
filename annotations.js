const text = document.getElementById("annotation-text");

// referenced from: https://d3-annotation.susielu.com/#examples
function annotation(x_pos, y_pos, w, h, offset, dx_pos, dy_pos, title_text, content, wrap) {
  const type = d3.annotationCalloutRect

  const annotations = [{
    note: {
      label: content,
      title: title_text
    },
    x: x_pos - offset/2,
    y: y_pos - offset/2,
    dy: dy_pos,
    dx: dx_pos,
    subject: {
      width: w + offset,
      height: h + offset
    }
  }]

  const makeAnnotations = d3.annotation()
    .notePadding(10)
    .textWrap(wrap)
    .type(type)
    .annotations(annotations)

  d3.select("svg")
    .append("g")
    .attr("class", "annotation-group")
    .call(makeAnnotations)
}

function annotationOverview() {
  text.innerHTML = "This chart visualizes the total global sales (in millions of copies) of video games released from 1980-2016 classified by genre."

  annotation(50, 50, barWidth*1, 300, 10, 350, 10, 
    "Highest Selling Genre", 
    "Globally, the highest selling genre is action.",
    200);

  // annotation(50+barWidth*11, 50, barWidth, 300, 10, -100, 140, 
  //  "Lowest Selling Genre", 
  //  "The lowest selling genre is strategy.",
  //  200);
}

function annotationNA() {
  text.innerHTML = "In North America, the top three most popular genres stay the same."

  annotation(50, 50, barWidth*1, 300, 10, 350, 10, 
    "North America", 
    "In North America, the highest selling genre is consistent with the global trend, with action games selling 877.8 million copies.",
    200);
}

function annotationEU() {
  text.innerHTML = "In Europe, the top three most popular genres again stay the same. However, there is some movement among the middlemost genres."

  annotation(50, 50, barWidth*1, 300, 10, 350, 10, 
    "Europe", 
    "In Europe, the highest selling genre is also consistent with the global trend, with action games selling 525.0 million copies.",
    200);
}

function annotationJP() {
  text.innerHTML = "In Japan, the market is strikingly different in both preferred genres and the number of copies sold."

  annotation(50, 50, barWidth*1, 300, 10, 350, 10, 
    "Japan", 
    "In Japan, the highest selling genre by far becomes role-playing.",
    200);

  annotation(50+barWidth*11, 50, barWidth, 300, 10, -100, 140, 
    "Shooters", 
    "The 3rd most popular genre globally globally sees the least copies sold.",
    200);
}

function annotationOther() {
  text.innerHTML = "This section is a compilation of all the other regions. They seem to follow the global trends resonably closely. However, the lower popularity genres are slightly different."

  annotation(50, 50, barWidth*3, 300, 10, 350, 10, 
    "Other Regions", 
    "The top 3 genres also stay consistent with the global trend in other regions combined.",
    200);
}
