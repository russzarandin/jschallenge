const canvas = document.getElementById('chart')
const ctx = canvas.getContext('2d')
const fetchButton = document.getElementById('fetchStocks');
const stockList = document.getElementById('stockList')
const stockDetails = document.getElementById('stockDetails')
let currentStockSymbol = null;

function drawLine (start, end, style) {
  ctx.beginPath()
  ctx.strokeStyle = style || 'black'
  ctx.moveTo(...start)
  ctx.lineTo(...end)
  ctx.stroke()
}

function drawTriangle (apex1, apex2, apex3) {
  ctx.beginPath()
  ctx.moveTo(...apex1)
  ctx.lineTo(...apex2)
  ctx.lineTo(...apex3)
  ctx.fill()
}

drawLine([50, 50], [50, 550])
drawTriangle([35, 50], [65, 50], [50, 35])

drawLine([50, 550], [950, 550])
drawTriangle([950, 535], [950, 565], [965, 550])

window.addEventListener("load", () => {
  const spinnerWrapper = document.querySelector(".spinnerWrapper");

  spinnerWrapper.classList.add("spinner-hidden");

  spinnerWrapper.addEventListener("transitionend", () => {
    spinnerWrapper.parentNode.removeChild(spinnerWrapper);
  });
});

fetchButton.addEventListener('click', async () => {
  try {
    const response = await fetch('/stocks');
    const data = await response.json();
    const stockSymbols = data.stockSymbols;
    displayStocks(stockSymbols);
  } catch (error) {
    console.error('Error fetching stocks:', error);
  }
});

function displayStocks(stockSymbols) {
  stockList.innerHTML = '';
  for (const symbol of stockSymbols) {
    const listItem = document.createElement('li');
    listItem.textContent = symbol;
    listItem.addEventListener('click', () => fetchStockDetails(symbol));
    stockList.appendChild(listItem);
  }
}

async function fetchStockDetails(symbol) {
  try {
    if (currentStockSymbol === symbol) {
      hideStockDetails();
      currentStockSymbol = null;
      return;
    }
    const response = await fetch(`/stocks/${symbol}`);
    const data = await response.json();
    const detailsHTML = generateDetailsHTML(data);
    displayStockDetails(detailsHTML);
    console.log('Stock details:', data)
  } catch (error) {
    console.error('Error fetching stock details:', error);
  }
}

function hideStockDetails() {
  const stockDetails = document.getElementById('stockDetails');
  stockDetails.innerHTML = '';
}

// Generate HTML for displaying stock details
function generateDetailsHTML(data) {
  let detailsHTML = '<h2>Stock Details</h2>';
  detailsHTML += '<ul>';
  data.forEach(point => {
    detailsHTML += `<li>Timestamp: ${point.timestamp}, Value: ${point.value}</li>`;
  });
  detailsHTML += '</ul>';
  return detailsHTML;
}

// Display stock details in the designated area (you need to define this area in your HTML)
function displayStockDetails(detailsHTML) {
  const stockDetails = document.getElementById('stockDetails');
  stockDetails.innerHTML = detailsHTML;
}