// Declare variables for Croppie instance and element
var croppieElement = document.getElementById('croppie');
var croppieInstance = null;

// Function to initialize or update Croppie instance
function updateCroppieSize() {
  var viewportWidth, boundaryWidth;
  if (window.innerWidth > 900) {
    viewportWidth = window.innerWidth * 0.5;
    boundaryWidth = window.innerWidth * 0.6;
  } else {
    viewportWidth = window.innerWidth * 0.8;
    boundaryWidth = window.innerWidth * 0.9;
  }
  var height = viewportWidth;

  // Destroy existing instance if it exists
  if (croppieInstance) {
    croppieInstance.destroy();
  }

  // Initialize a new Croppie instance with updated size
  croppieInstance = new Croppie(croppieElement, {
    viewport: { width: viewportWidth, height: height, type: 'circle' },
    boundary: { width: boundaryWidth, height: boundaryWidth }
  });

  // Bind placeholder image to the new instance
  croppieInstance.bind({
    url: "https://raw.githubusercontent.com/ik2i03/cropp/main/IMG_0313.PNG"
  });
}

// Listen for window resize events and page load to update Croppie size
window.addEventListener('resize', updateCroppieSize);
document.addEventListener('DOMContentLoaded', updateCroppieSize);  // Add this line

// Image upload event
document.getElementById('upload').addEventListener('change', function () {
  var reader = new FileReader();
  reader.onload = function (e) {
    if (croppieInstance) {
      croppieInstance.bind({
        url: e.target.result
      });
    }
  };
  reader.readAsDataURL(this.files[0]);
});

// Download button click event
document.getElementById('download').addEventListener('click', function () {
  if (!croppieInstance) return;

  document.getElementById('loader').style.display = 'block';
  croppieInstance.result({
    type: 'blob',
    size: 'original',
    quality: 1,
    format: 'png'
  }).then(function (blob) {
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'cropped_image.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }).finally(function() {
    document.getElementById('loader').style.display = 'none';
  });
});

// 1px単位での微調整機能
function moveCroppie(x, y) {
  var transform = Transform.parse(croppieInstance.elements.preview.style.transform);
  transform.x += x;
  transform.y += y;
  var newCss = {};
  newCss.transform = transform.toString();
  css(croppieInstance.elements.preview, newCss);
}

// ボタンイベントリスナー
document.getElementById('move-left').addEventListener('click', () => moveCroppie(-1, 0));
document.getElementById('move-right').addEventListener('click', () => moveCroppie(1, 0));
document.getElementById('move-up').addEventListener('click', () => moveCroppie(0, -1));
document.getElementById('move-down').addEventListener('click', () => moveCroppie(0, 1));

