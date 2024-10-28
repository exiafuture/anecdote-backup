```js
if (navigator.connection) {
    const downlink = navigator.connection.downlink;
    console.log(`${downlink}`);
} else {
    console.error("error");
}
```

```js
if (navigator.vibrate) {
    navigator.vibrate(500);
}
```

```js
<input type='text'></input>
<script>
    const input = document.querySelector('input');
    input.addEventListener("paste",function(e){
        e.preventDefault()
    })
</script>
```

```html
<p hidden>hey</p>
```

```css
div {
    position: absolute;
    top:0;
}

div {
    position: absolute;
    inset: 0;
}
```

```js
console.time("time");
console.timeEnd("time");
```

```css
body {
    overscroll-behavior-y: contain;
}
```

```js
document.body.contentEditable = "true";
```

```css
p:empty {
    display:none;
}
```