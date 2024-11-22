import React from 'react'

function Loader() {
  return (
    <div>
      <div class="flex items-center justify-center space-x-2 text-xl font-bold">
        <span>Loading</span>
        <span class="animate-dot-blink">.</span>
        <span class="animate-dot-blink delay-300">.</span>
        <span class="animate-dot-blink delay-600">.</span>
        <span class="animate-dot-blink delay-600">.</span>
        <span class="animate-dot-blink delay-600">.</span>
        <span class="animate-dot-blink delay-600">.</span>
      </div>
    </div>
  );
}

export default Loader