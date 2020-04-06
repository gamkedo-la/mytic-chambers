
var currentLevel = 1;
var totalLevels = 10;
const levelPrefix = "levels/lv";
const levelPostfix = ".txt";

var editorSprite = new Sprite(tr(vec2A(window.innerWidth/10,0,vec2(window.innerWidth/10,window.innerWidth/10),ANCHOR_BOTTOMLEFT)), vec2(window.innerWidth/10,window.innerWidth/10));

function getLevelName() { return levelPrefix + currentLevel.toString() + levelPostfix; }

function loadLevel(walls, areas)
{
    var lvStr = readFile(getLevelName());
    generateWallsFromString(walls, lvStr.split(".")[0]);
    generateAreasFromString(areas, lvStr.split(".")[1]);
    resetWallIndexes();
}

function editorInit(walls, areas)
{
    loadLevel(walls, areas);
}

function editorEvents(deltaTime, offset, walls, areas, decorEnts, itemEnts, enemyEnts)
{
    if(cpEditPanel.enabled)
    {
        addOffsetToLists([walls, areas, decorEnts, itemEnts, enemyEnts], offset.negative());

        boxHandleEvent(offset);
        if(cpEditTabs[0].selector.selected) wallHandleEvents(walls, offset);
        if(cpEditTabs[1].selector.selected) areaHandleEvents(areas, offset);
        if(cpEditTabs[2].selector.selected) decorHandleEvents(decorEnts, offset);
        if(cpEditTabs[3].selector.selected) itemHandleEvents(itemEnts, offset);
        if(cpEditTabs[4].selector.selected) enemyHandleEvents(enemyEnts, offset);

        if(walls.length <= 0 || typeof activeSector == "undefined")
        {
            cpEditTabs[0].selector.selected = true;
            cpEditTabs[1].selector.selected = cpEditTabs[2].selector.selected =
            cpEditTabs[3].selector.selected = cpEditTabs[4].selector.selected = false;
            currentWallType = 0;
        }

        addOffsetToLists([walls, areas, decorEnts, itemEnts, enemyEnts], offset);
    }
}

function editorUpdate(deltaTime)
{

}

function editorDraw(renderer, offset, walls, areas, decorEnts, itemEnts, enemyEnts)
{
    if(cpEditPanel.enabled)
    {
        addOffsetToLists([walls, areas, decorEnts, itemEnts, enemyEnts], offset.negative());

        editorDrawBox(renderer);
        editorDrawGrid(renderer);
        if(cpEditTabs[0].selector.selected)
        {
            editorDrawWallHandles(renderer, walls);
            editorSprite.imageObject = wallImages[currentWallType];
            editorSprite.drawSc();
        }
        if(cpEditTabs[1].selector.selected) editorDrawAreaHandles(renderer, areas);
        if(cpEditTabs[2].selector.selected)
        {
            editorDrawDecorHandles(renderer, decorEnts);
            editorSprite.imageObject = entImg[currentEntityType];
            editorSprite.drawScIn(vec2(0, 0), vec2(160, 160));
        }
        if(cpEditTabs[3].selector.selected)
        {
            editorDrawItemHandles(renderer, itemEnts);
            editorSprite.imageObject = entImg[currentEntityType];
            editorSprite.drawScIn(vec2(0, 0), vec2(160, 160));
        }
        if(cpEditTabs[4].selector.selected)
        {
            editorDrawEnemyHandles(renderer, enemyEnts);
            editorSprite.imageObject = entImg[currentEntityType];
            editorSprite.drawScIn(vec2(0, 0), vec2(160, 160));
        }

        addOffsetToLists([walls, areas, decorEnts, itemEnts, enemyEnts], offset);
    }
}

function snapWallToGrid(wall, offset)
{
    wall.addOffset(vec2(offset.x, offset.y).add(vec2(100000, 100000)));

    if(wall.p1.x % gridCellSize < (wall.p1.x + (gridCellSize/2)) % gridCellSize)
        wall.p1.x = wall.p1.x - (wall.p1.x % gridCellSize);
    else
        wall.p1.x = wall.p1.x + ((wall.p1.x + (gridCellSize/2)) % gridCellSize);
    if(wall.p1.y % gridCellSize < (wall.p1.y + (gridCellSize/2)) % gridCellSize)
        wall.p1.y = wall.p1.y - (wall.p1.y % gridCellSize);
    else
        wall.p1.y = wall.p1.y + ((wall.p1.y + (gridCellSize/2)) % gridCellSize);

    if(wall.p2.x % gridCellSize < (wall.p2.x + (gridCellSize/2)) % gridCellSize)
        wall.p2.x = wall.p2.x - (wall.p2.x % gridCellSize);
    else
        wall.p2.x = wall.p2.x + ((wall.p2.x + (gridCellSize/2)) % gridCellSize);
    if(wall.p2.y % gridCellSize < (wall.p2.y + (gridCellSize/2)) % gridCellSize)
        wall.p2.y = wall.p2.y - (wall.p2.y % gridCellSize);
    else
        wall.p2.y = wall.p2.y + ((wall.p2.y + (gridCellSize/2)) % gridCellSize);
    
    wall.addOffset(vec2(-offset.x, -offset.y).add(vec2(-100000, -100000)));

    wall.angle = wall.p1.angle(wall.p2);
}

function snapWallsToGrid(walls, offset)
{
    for(let i = 0; i < walls.length; i++)
        snapWallToGrid(walls[i], offset);
}

function snapAreaToGrid(area, offset)
{
    area.addOffset(vec2(offset.x, offset.y).add(vec2(100000, 100000)));
    area.pos = vec2(
        area.pos.x - (area.pos.x % gridCellSize),
        area.pos.y - (area.pos.y % gridCellSize));
    area.size = vec2(
        area.size.x - (area.size.x % gridCellSize),
        area.size.y - (area.size.y % gridCellSize));
    area.addOffset(vec2(-offset.x, -offset.y).add(vec2(-100000, -100000)));
}

function snapAreasToGrid(areas, offset)
{
    for(let i = 0; i < areas.length; i++)
        snapAreaToGrid(areas[i], offset);
}