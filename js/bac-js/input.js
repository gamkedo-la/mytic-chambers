function onResize(ev)
{
    renderer.canvas.width = window.innerWidth;
    renderer.canvas.height = window.innerHeight;
}

var isTouched = false;
var isTouchMoved = false;
var touchPos = [vec2(0, 0), vec2(0, 0), vec2(0, 0), vec2(0, 0), vec2(0, 0)];
var relTouchPos = [vec2(0, 0), vec2(0, 0), vec2(0, 0), vec2(0, 0), vec2(0, 0)];
var wheelScroll = 0;

var keysDown = [];
var keysPressed = [];

function onTouchStart(ev)
{
    isTouched = true;

    for (let i = 0; i < ev.touches.length; i++)
        touchPos[i] = vec2(ev.touches[i].clientX, ev.touches[i].clientY);
}

function onTouchMove(ev)
{
    isTouchMoved = true;
    for (let i = 0; i < ev.touches.length; i++)
    {
        if(isTouched && (touchPos[i].x != 0.0 && touchPos[i].y != 0.0))
            relTouchPos[i] = vec2(ev.touches[i].clientX, ev.touches[i].clientY).subtract(touchPos[i]);
        
        touchPos[i] = vec2(ev.touches[i].clientX, ev.touches[i].clientY);
    }
}

function onTouchEnd(ev)
{
    for(let i = 0; i < 5; i++)
    {
        if(i >= ev.touches.length)
        {
            touchPos[i] = vec2(0, 0);
            relTouchPos[i] = vec2(0, 0);
        }
    }
    
    if(ev.touches.length <= 0)
        isTouched = false;
}

function onMouseDown(ev)
{
    isTouched = true;
    touchPos[0] = vec2(ev.clientX, ev.clientY);
}

function onMouseMove(ev)
{
    isTouchMoved = true;

    if(isPointerLocked())
    {
        var mvX = ev.movementX || ev.mozMovementX || 0;
        var mvY = ev.movementY || ev.mozMovementY || 0;
        relTouchPos[0] = relTouchPos[0].add(vec2(mvX, mvY));
    }
    else
    {
        relTouchPos[0] = vec2(ev.clientX, ev.clientY).subtract(touchPos[0]);
    }

    touchPos[0] = vec2(ev.clientX, ev.clientY);
}

function onMouseUp(ev)
{
    isTouched = false;
}

function onMouseWheelScroll(ev)
{
    wheelScroll = ev.deltaY;
}

function isPointerLocked()
{
    return document.pointerLockElement === canvas || document.mozPointerLockElement === canvas;
}

function onKeyDown(ev)
{
    if(keysDown.indexOf(ev.key) == -1)
        keysDown.push(ev.key);
}

function onKeyPress(ev)
{
    if(keysPressed.indexOf(ev.key) == -1)
        keysPressed.push(ev.key);
}

function onKeyUp(ev)
{
    var i = keysDown.indexOf(ev.key);
    if(i != -1) keysDown.splice(i, 1);
}

function inputSetup()
{
    window.addEventListener("resize", onResize);
    
    //For Mobile
    window.addEventListener("touchstart", onTouchStart);
    window.addEventListener("touchmove", onTouchMove);
    window.addEventListener("touchend", onTouchEnd);

    //For PC
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("wheel", onMouseWheelScroll);

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keypress", onKeyPress);
    window.addEventListener("keyup", onKeyUp);
}

function touched(transform) //or sprite
{
    if (isTouched)
    {
        for(let i = 0; i < 5; i++)
        {
            var p = transform.relPointInside(touchPos[i]);

            if (p.x != -1 && p.y != -1)
                return i;
        }
    }

    return -1;
}

function hover(transform) //or sprite
{
    if (isTouchMoved && !isTouched)
    {
        for(let i = 0; i < 5; i++)
        {
            var p = transform.relPointInside(touchPos[i]);
        
            if(p.x != -1 && p.y != -1)
                return true;
        }
    }
    
    return false;
}

dragMoveObj = null;
dragMoveRelPos = vec2(-1, -1);
function dragMove(transform, lerpAmount, limitPoint1, limitPoint2)
{
    if (isTouched)
    {
        if (dragMoveObj == null)
        {
            var p = transform.relPointInside(touchPos[0]);

            if (p.x != -1 && p.y != -1)
            {
                dragMoveObj = transform;
                dragMoveRelPos = p.invert();
            }
        }
        else if (isTouchMoved)
        {
            if(dragMoveObj == transform)
			{
				lerpAmount = typeof lerpAmount == "undefined" ? 1.0 : lerpAmount;
                transform.position = lerpVec2(transform.position, touchPos[0].add(dragMoveRelPos), lerpAmount);
                
                if(typeof limitPoint1 == "undefined") return;
                
				if(transform.position.x < limitPoint1.x) transform.position.x = limitPoint1.x;
				else if(transform.position.x + transform.scale.x > limitPoint2.x) transform.position.x = limitPoint2.x - transform.scale.x;
				if(transform.position.y < limitPoint1.y) transform.position.y = limitPoint1.y;
				else if(transform.position.y + transform.scale.y > limitPoint2.y) transform.position.y = limitPoint2.y - transform.scale.y;
			}
        }
    }
    else
    {
        dragMoveObj = null;
        dragMoveRelPos = vec2( -1, -1 );
    }
}