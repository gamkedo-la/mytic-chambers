
var itemPickupFlashFrames = 5;
var itemPickupFlash = 0;
var itemPickupFlashColor = "#FFFFFF15";

class ItemManager {

    constructor()
    {
        this.ents = [];
    }

    add(x, y, id, offset)
    {
        var ent = new Entity();
        ent.set(x, y, id);
        if(typeof offset != "undefined") ent.renderOffset = offset;

        if (id!=ENT_BARREL_RED && id!=ENT_BARREL_STEEL) {
            ent.ai = aiSpinningBobbing;
        }

        this.ents.push(ent);
        entities.push(ent);
    }

    check(plPos)
    {
        for(let i = 0; i < this.ents.length; i++)
        {
            var coll = this.ents[i].getCollValue(plPos);
            if(coll.x != 0.0 && coll.y != 0.0)
            {
                var shouldDestroy = true;
                switch(this.ents[i].id)
                {
                    case ENT_HEALTHBOX:
                        playerHealth += 25;
                        if(playerHealth > playerMaxHealth)
                            playerHealth = playerMaxHealth;
                        break;

                    case ENT_REDKEY:
                        availableKeys[KEY_RED] = true;
                        break;

                    case ENT_GREENKEY:
                        availableKeys[KEY_GREEN] = true;
                        break;

                    case ENT_BLUEKEY:
                        availableKeys[KEY_BLUE] = true;
                        break;

                    case ENT_REVOLVERGUN:
                        availableGuns[GUN_REVOLVER] = true;
                        changeGun(GUN_REVOLVER);
                        totalAmmo[GUN_REVOLVER] += ammoItemIncrement[GUN_REVOLVER];
                        ammoInGun[GUN_REVOLVER] = gunAmmoCapacity[GUN_REVOLVER];
                        break;

                    case ENT_REVOLVERAMMO:
                        totalAmmo[GUN_REVOLVER] += ammoItemIncrement[GUN_REVOLVER];
                        break;

                    case ENT_WINCHESTERGUN:
                        availableGuns[GUN_WINCHESTER] = true;
                        changeGun(GUN_WINCHESTER);
                        totalAmmo[GUN_WINCHESTER] += ammoItemIncrement[GUN_REVOLVER];
                        ammoInGun[GUN_WINCHESTER] = gunAmmoCapacity[GUN_WINCHESTER];
                        break;

                    case ENT_WINCHESTERAMMO:
                        totalAmmo[GUN_WINCHESTER] += ammoItemIncrement[GUN_WINCHESTER];
                        break;

                    case ENT_BARREL_STEEL:
                        // FIXME play metal clang sound, but otherwise do nothing
                        // console.log("steel barrel hit!");
                        shouldDestroy = false;
                        break;

                    case ENT_BARREL_RED:
                        // FIXME explode!
                        // console.log("red barrel hit!");
                        shouldDestroy = false; // TODO: BOOM!!!!
                        break;

                    default:
                        //do nothing
                }

                if (shouldDestroy)
                {
                    removeEntityInSector(this.ents[i]);
                    removeEntity(this.ents[i]);
                    this.ents.splice(i, 1);
                    i--;

                    itemPickupFlash += itemPickupFlashFrames;
                }
            }
        }
    }
}

var items = new ItemManager();