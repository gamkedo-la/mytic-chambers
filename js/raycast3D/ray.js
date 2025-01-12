class RaycastData
{
    constructor(px, py, pdist, index)
    {
        this.px = px;
        this.py = py;
        this.pdist = pdist;
        this.index = index;
    }

    set(px, py, pdist, index)
    {
        this.px = px;
        this.py = py;
        this.pdist = pdist;
        this.index = index;
    }
}

nextRenderSector = undefined;
class Ray
{
    constructor(vec2, angle)
    {
        this.p = vec2;
        this.angle = angle;
        this.length = 240.0;
    }

    raycastWall(w, o, raycast)
    {
        var x1 = this.p.x;
        var y1 = this.p.y;
        var x2 = this.p.x + (this.length * Math.cos(degToRad(this.angle)));
        var y2 = this.p.y + (this.length * Math.sin(degToRad(this.angle)));

        var x3 = w.p1.x;
        var y3 = w.p1.y;
        var x4 = w.p2.x;
        var y4 = w.p2.y;

        var denominator = ((x1 - x2) * (y3 - y4)) - ((y1 - y2) * (x3 - x4));

        if(denominator != 0.0)
        {
            var _px = ((((x1 * y2) - (y1 * x2)) * (x3 - x4))
            - ((x1 - x2) * ((x3 * y4) - (y3 * x4))))
            / denominator;

            var _py = ((((x1 * y2) - (y1 * x2)) * (y3 - y4))
            - ((y1 - y2) * ((x3 * y4) - (y3 * x4))))
            / denominator;

            var _pdist = getDistBtwVec2(vec2(x1, y1), vec2(_px, _py));

            if(isPointOnLine( vec2(x3, y3), vec2(x4, y4), vec2(_px, _py), 0.01 )
            && isPointOnLine( vec2(x1, y1), vec2(x2, y2), vec2(_px, _py), 0.01 )
            && Math.abs(_pdist) < Math.abs(raycast.pdist))
            {
                raycast.set(_px, _py, _pdist, o);
            }
        }
    }

    raycastSector(w, plPos, sec, last, entitySectors)
    {
        if(typeof last == "undefined") last = false;

        var sectorPresent = false;
        var data = new WallData();
        var raycast = new RaycastData(this.p.x, this.p.y, this.length, -1);

        var sector = undefined;
        if(typeof sec != "undefined") sector = sec;
        else if(typeof activeSector != "undefined") sector = activeSector;
        
        if(typeof sector != "undefined")
        {
            var pos = detectActiveSector(sector, plPos);

            if(pos < 0)
            {
                if(!last && typeof sector.sectorData.wallsLeft != "undefined")
                {
                    for(let i = 0; i < sector.sectorData.wallsLeft.length; i++)
                        this.raycastWall(sector.sectorData.wallsLeft[i], sector.sectorData.wallsLeft[i].index, raycast);
                
                    if(raycast.index <= -1)
                    {
                        if(typeof sector.sectorData.sectorsRight != "undefined")
                        {
                            for(let i = 0; i < sector.sectorData.sectorsRight.length; i++)
                            {
                                this.raycastWall(sector.sectorData.sectorsRight[i], sector.sectorData.sectorsRight[i].index, raycast);

                                if(raycast.index > -1)
                                {
                                    sectorPresent = false;
                                    if(typeof entitySectors != "undefined")
                                        for(let e = 0; e < entitySectors.length; e++)
                                        {
                                            if(entitySectors[e] == sector.sectorData.sectorsRight[i])
                                                sectorPresent = true;
                                        }
                                    if(!sectorPresent) nextRenderSector = sector.sectorData.sectorsRight[i];
                                }
                            }
                        }

                        if(typeof sector.sectorData.sectorsLeft != "undefined")
                        {
                            for(let i = 0; i < sector.sectorData.sectorsLeft.length; i++)
                            {
                                this.raycastWall(sector.sectorData.sectorsLeft[i], sector.sectorData.sectorsLeft[i].index, raycast);

                                if(raycast.index > -1)
                                {
                                    sectorPresent = false;
                                    if(typeof entitySectors != "undefined")
                                        for(let e = 0; e < entitySectors.length; e++)
                                        {
                                            if(entitySectors[e] == sector.sectorData.sectorsLeft[i])
                                                sectorPresent = true;
                                        }
                                    if(!sectorPresent) nextRenderSector = sector.sectorData.sectorsLeft[i];
                                }
                            }
                        }
                    }
                }

                if(last)
                {
                    if(typeof sector.sectorData.wallsRight != "undefined")
                    {
                        for(let i = 0; i < sector.sectorData.wallsRight.length; i++)
                            this.raycastWall(sector.sectorData.wallsRight[i], sector.sectorData.wallsRight[i].index, raycast);
                    }
                }
            }
            else if(pos > 0)
            {
                if(!last && typeof sector.sectorData.wallsRight != "undefined")
                {
                    for(let i = 0; i < sector.sectorData.wallsRight.length; i++)
                        this.raycastWall(sector.sectorData.wallsRight[i], sector.sectorData.wallsRight[i].index, raycast);

                    if(raycast.index <= -1)
                    {
                        if(typeof sector.sectorData.sectorsLeft != "undefined")
                        {
                            for(let i = 0; i < sector.sectorData.sectorsLeft.length; i++)
                            {
                                this.raycastWall(sector.sectorData.sectorsLeft[i], sector.sectorData.sectorsLeft[i].index, raycast);

                                if(raycast.index > -1)
                                {
                                    sectorPresent = false;
                                    if(typeof entitySectors != "undefined")
                                        for(let e = 0; e < entitySectors.length; e++)
                                        {
                                            if(entitySectors[e] == sector.sectorData.sectorsLeft[i])
                                                sectorPresent = true;
                                        }
                                    if(!sectorPresent) nextRenderSector = sector.sectorData.sectorsLeft[i];
                                }
                            }
                        }

                        if(typeof sector.sectorData.sectorsRight != "undefined")
                        {
                            for(let i = 0; i < sector.sectorData.sectorsRight.length; i++)
                            {
                                this.raycastWall(sector.sectorData.sectorsRight[i], sector.sectorData.sectorsRight[i].index, raycast);

                                if(raycast.index > -1)
                                {
                                    sectorPresent = false;
                                    if(typeof entitySectors != "undefined")
                                        for(let e = 0; e < entitySectors.length; e++)
                                        {
                                            if(entitySectors[e] == sector.sectorData.sectorsRight[i])
                                                sectorPresent = true;
                                        }
                                    if(!sectorPresent) nextRenderSector = sector.sectorData.sectorsRight[i];
                                }
                            }
                        }
                    }
                }

                if(last)
                {
                    if(typeof sector.sectorData.wallsLeft != "undefined")
                    {
                        for(let i = 0; i < sector.sectorData.wallsLeft.length; i++)
                            this.raycastWall(sector.sectorData.wallsLeft[i], sector.sectorData.wallsLeft[i].index, raycast);
                    }
                }
            }

            /*
            //All-Ray-Iteration-And-Draw Technique
            //Least number of iterations; Most Performant
            //BUT it doesn't work with entities rendering

            if(pos < 0)
            {
                if(typeof sector.sectorData.wallsLeft != "undefined")
                {
                    for(let i = 0; i < sector.sectorData.wallsLeft.length; i++)
                        this.raycastWall(sector, pos, sector.sectorData.wallsLeft[i], sector.sectorData.wallsLeft[i].index, raycast);

                    if(raycast.index <= -1)
                    {
                        if(typeof sector.sectorData.sectorsRight != "undefined")
                        {
                            for(let i = 0; i < sector.sectorData.sectorsRight.length; i++)
                            {
                                this.raycastWall(sector, pos, sector.sectorData.sectorsRight[i], sector.sectorData.sectorsRight[i].index, raycast);
                                if(raycast.index >= 0) { castedSector = sector.sectorData.sectorsRight[i]; return this.raycastSector(renderer, w, plRay, plPos, castedSector); }
                            }
                        }
                    }
                }

                if(raycast.index <= -1)
                {
                    this.raycastWall(sector, pos, sector, sector.index, sectorcast);
                    if(sectorcast.index > 0)
                    {
                        if(typeof sector.sectorData.wallsRight != "undefined")
                        {
                            for(let i = 0; i < sector.sectorData.wallsRight.length; i++)
                                this.raycastWall(sector, pos, sector.sectorData.wallsRight[i], sector.sectorData.wallsRight[i].index, raycast);
                        }
                    }
                }

                if(raycast.index <= -1)
                {
                    if(typeof sector.sectorData.sectorsLeft != "undefined")
                    {
                        for(let i = 0; i < sector.sectorData.sectorsLeft.length; i++)
                        {
                            this.raycastWall(sector, pos, sector.sectorData.sectorsLeft[i], sector.sectorData.sectorsLeft[i].index, raycast);
                            if(raycast.index >= 0) { castedSector = sector.sectorData.sectorsLeft[i]; return this.raycastSector(renderer, w, plRay, plPos, castedSector); }
                        }
                    }
                }
            }
            else
            {
                if(typeof sector.sectorData.wallsRight != "undefined")
                {
                    for(let i = 0; i < sector.sectorData.wallsRight.length; i++)
                    {
                        this.raycastWall(sector, pos, sector.sectorData.wallsRight[i], sector.sectorData.wallsRight[i].index, raycast);
                    }

                    if(raycast.index <= -1)
                    {
                        if(typeof sector.sectorData.sectorsLeft != "undefined")
                        {
                            for(let i = 0; i < sector.sectorData.sectorsLeft.length; i++)
                            {
                                this.raycastWall(sector, pos, sector.sectorData.sectorsLeft[i], sector.sectorData.sectorsLeft[i].index, raycast);
                                if(raycast.index >= 0) { castedSector = sector.sectorData.sectorsLeft[i]; return this.raycastSector(renderer, w, plRay, plPos, castedSector); }
                            }
                        }
                    }
                }

                if(raycast.index <= -1)
                {
                    this.raycastWall(sector, pos, sector, sector.index, sectorcast);
                    if(sectorcast.index > 0)
                    {
                        if(typeof sector.sectorData.wallsLeft != "undefined")
                        {
                            for(let i = 0; i < sector.sectorData.wallsLeft.length; i++)
                                this.raycastWall(sector, pos, sector.sectorData.wallsLeft[i], sector.sectorData.wallsLeft[i].index, raycast);
                        }
                    }
                }

                if(raycast.index <= -1)
                {
                    if(typeof sector.sectorData.sectorsRight != "undefined")
                    {
                        for(let i = 0; i < sector.sectorData.sectorsRight.length; i++)
                        {
                            this.raycastWall(sector, pos, sector.sectorData.sectorsRight[i], sector.sectorData.sectorsRight[i].index, raycast);
                            if(raycast.index >= 0) { castedSector = sector.sectorData.sectorsRight[i]; return this.raycastSector(renderer, w, plRay, plPos, castedSector); }
                        }
                    }
                }
            }*/
        }

        if(raycast.index > -1 && w[raycast.index]!=undefined && w[raycast.index].type > 0)
        {
            data.index = w[raycast.index].index;
            data.depth = raycast.pdist;
            data.lengthPoint = getDistBtwVec2( w[raycast.index].p1, vec2(raycast.px, raycast.py) );
            data.length = getDistBtwVec2( w[raycast.index].p1, w[raycast.index].p2 );
            data.angle = w[raycast.index].angle;
            data.type = w[raycast.index].type;
            data.decal = w[raycast.index].decal;
        }
        else
        {
            data.index = -1;
        }

        return data;
    }

    draw(renderer, w, show)
    {
        var data = new WallData();
        var raycast = new RaycastData(this.p.x, this.p.y, this.length, -1);
        var pangle = this.angle;

        for(let o = 0; o < w.length; o++)
        {
            if(w[o].type == 0) continue;
            this.raycastWall(w[o], o, raycast);
        }

        if(show)
        {
            drawLine(renderer, vec2(this.p.x, this.p.y),
                vec2(this.p.x + (raycast.pdist * Math.cos(degToRad(pangle))),
                this.p.y + (raycast.pdist * Math.sin(degToRad(pangle)))),
                "#0000ff11");
        }

        if(raycast.index > -1)
        {
            data.index = w[raycast.index].index;
            data.depth = raycast.pdist;
            data.lengthPoint = getDistBtwVec2( w[raycast.index].p1, vec2(raycast.px, raycast.py) );
            data.length = getDistBtwVec2( w[raycast.index].p1, w[raycast.index].p2 );
            data.angle = w[raycast.index].angle;
            data.type = w[raycast.index].type;
            data.decal = w[raycast.index].decal;
        }

        return data;
    }

    addOffset(vec2)
    {
        this.p.x += vec2.x;
        this.p.y += vec2.y;
    }
}