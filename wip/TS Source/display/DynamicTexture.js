var Phaser;
(function (Phaser) {
    /// <reference path="../_definitions.ts" />
    /**
    * Phaser - Display - DynamicTexture
    *
    * A DynamicTexture can be thought of as a mini canvas into which you can draw anything.
    * Game Objects can be assigned a DynamicTexture, so when they render in the world they do so
    * based on the contents of the texture at the time. This allows you to create powerful effects
    * once and have them replicated across as many game objects as you like.
    */
    (function (Display) {
        var DynamicTexture = (function () {
            /**
            * DynamicTexture constructor
            * Create a new <code>DynamicTexture</code>.
            *
            * @param game {Phaser.Game} Current game instance.
            * @param width {number} Init width of this texture.
            * @param height {number} Init height of this texture.
            */
            function DynamicTexture(game, width, height) {
                this._sx = 0;
                this._sy = 0;
                this._sw = 0;
                this._sh = 0;
                this._dx = 0;
                this._dy = 0;
                this._dw = 0;
                this._dh = 0;
                /**
                * You can set a globalCompositeOperation that will be applied before the render method is called on this Sprite.
                * This is useful if you wish to apply an effect like 'lighten'.
                * If this value is set it will call a canvas context save and restore before and after the render pass, so use it sparingly.
                * Set to null to disable.
                */
                this.globalCompositeOperation = null;
                this.game = game;
                this.type = Phaser.Types.DYNAMICTEXTURE;
                this.canvas = document.createElement('canvas');
                this.canvas.width = width;
                this.canvas.height = height;
                this.context = this.canvas.getContext('2d');
                this.css3 = new Phaser.Display.CSS3Filters(this.canvas);
                this.bounds = new Phaser.Rectangle(0, 0, width, height);
            }
            DynamicTexture.prototype.getPixel = /**
            * Get a color of a specific pixel.
            * @param x {number} X position of the pixel in this texture.
            * @param y {number} Y position of the pixel in this texture.
            * @return {number} A native color value integer (format: 0xRRGGBB)
            */
            function (x, y) {
                //r = imageData.data[0];
                //g = imageData.data[1];
                //b = imageData.data[2];
                //a = imageData.data[3];
                var imageData = this.context.getImageData(x, y, 1, 1);
                return Phaser.ColorUtils.getColor(imageData.data[0], imageData.data[1], imageData.data[2]);
            };
            DynamicTexture.prototype.getPixel32 = /**
            * Get a color of a specific pixel (including alpha value).
            * @param x {number} X position of the pixel in this texture.
            * @param y {number} Y position of the pixel in this texture.
            * @return  A native color value integer (format: 0xAARRGGBB)
            */
            function (x, y) {
                var imageData = this.context.getImageData(x, y, 1, 1);
                return Phaser.ColorUtils.getColor32(imageData.data[3], imageData.data[0], imageData.data[1], imageData.data[2]);
            };
            DynamicTexture.prototype.getPixels = /**
            * Get pixels in array in a specific Rectangle.
            * @param rect {Rectangle} The specific Rectangle.
            * @returns {array} CanvasPixelArray.
            */
            function (rect) {
                return this.context.getImageData(rect.x, rect.y, rect.width, rect.height);
            };
            DynamicTexture.prototype.setPixel = /**
            * Set color of a specific pixel.
            * @param x {number} X position of the target pixel.
            * @param y {number} Y position of the target pixel.
            * @param color {number} Native integer with color value. (format: 0xRRGGBB)
            */
            function (x, y, color) {
                this.context.fillStyle = color;
                this.context.fillRect(x, y, 1, 1);
            };
            DynamicTexture.prototype.setPixel32 = /**
            * Set color (with alpha) of a specific pixel.
            * @param x {number} X position of the target pixel.
            * @param y {number} Y position of the target pixel.
            * @param color {number} Native integer with color value. (format: 0xAARRGGBB)
            */
            function (x, y, color) {
                this.context.fillStyle = color;
                this.context.fillRect(x, y, 1, 1);
            };
            DynamicTexture.prototype.setPixels = /**
            * Set image data to a specific Rectangle.
            * @param rect {Rectangle} Target Rectangle.
            * @param input {object} Source image data.
            */
            function (rect, input) {
                this.context.putImageData(input, rect.x, rect.y);
            };
            DynamicTexture.prototype.fillRect = /**
            * Fill a given Rectangle with specific color.
            * @param rect {Rectangle} Target Rectangle you want to fill.
            * @param color {number} A native number with color value. (format: 0xRRGGBB)
            */
            function (rect, color) {
                this.context.fillStyle = color;
                this.context.fillRect(rect.x, rect.y, rect.width, rect.height);
            };
            DynamicTexture.prototype.pasteImage = /**
            *
            */
            function (key, frame, destX, destY, destWidth, destHeight) {
                if (typeof frame === "undefined") { frame = -1; }
                if (typeof destX === "undefined") { destX = 0; }
                if (typeof destY === "undefined") { destY = 0; }
                if (typeof destWidth === "undefined") { destWidth = null; }
                if (typeof destHeight === "undefined") { destHeight = null; }
                var texture = null;
                var frameData;
                this._sx = 0;
                this._sy = 0;
                this._dx = destX;
                this._dy = destY;
                //  TODO - Load a frame from a sprite sheet, otherwise we'll draw the whole lot
                if(frame > -1) {
                    //if (this.game.cache.isSpriteSheet(key))
                    //{
                    //    texture = this.game.cache.getImage(key);
                    //this.animations.loadFrameData(this.game.cache.getFrameData(key));
                    //}
                                    } else {
                    texture = this.game.cache.getImage(key);
                    this._sw = texture.width;
                    this._sh = texture.height;
                    this._dw = texture.width;
                    this._dh = texture.height;
                }
                if(destWidth !== null) {
                    this._dw = destWidth;
                }
                if(destHeight !== null) {
                    this._dh = destHeight;
                }
                if(texture != null) {
                    this.context.drawImage(texture, //  Source Image
                    this._sx, //  Source X (location within the source image)
                    this._sy, //  Source Y
                    this._sw, //  Source Width
                    this._sh, //  Source Height
                    this._dx, //  Destination X (where on the canvas it'll be drawn)
                    this._dy, //  Destination Y
                    this._dw, //  Destination Width (always same as Source Width unless scaled)
                    this._dh);
                    //  Destination Height (always same as Source Height unless scaled)
                                    }
            };
            DynamicTexture.prototype.copyPixels = //  TODO - Add in support for: alphaBitmapData: BitmapData = null, alphaPoint: Point = null, mergeAlpha: bool = false
            /**
            * Copy pixel from another DynamicTexture to this texture.
            * @param sourceTexture {DynamicTexture} Source texture object.
            * @param sourceRect {Rectangle} The specific region Rectangle to be copied to this in the source.
            * @param destPoint {Point} Top-left point the target image data will be paste at.
            */
            function (sourceTexture, sourceRect, destPoint) {
                //  Swap for drawImage if the sourceRect is the same size as the sourceTexture to avoid a costly getImageData call
                if(Phaser.RectangleUtils.equals(sourceRect, this.bounds) == true) {
                    this.context.drawImage(sourceTexture.canvas, destPoint.x, destPoint.y);
                } else {
                    this.context.putImageData(sourceTexture.getPixels(sourceRect), destPoint.x, destPoint.y);
                }
            };
            DynamicTexture.prototype.add = function (sprite) {
                sprite.texture.canvas = this.canvas;
                sprite.texture.context = this.context;
            };
            DynamicTexture.prototype.assignCanvasToGameObjects = /**
            * Given an array of Sprites it will update each of them so that their canvas/contexts reference this DynamicTexture
            * @param objects {Array} An array of GameObjects, or objects that inherit from it such as Sprites
            */
            function (objects) {
                for(var i = 0; i < objects.length; i++) {
                    if(objects[i].texture) {
                        objects[i].texture.canvas = this.canvas;
                        objects[i].texture.context = this.context;
                    }
                }
            };
            DynamicTexture.prototype.clear = /**
            * Clear the whole canvas.
            */
            function () {
                this.context.clearRect(0, 0, this.bounds.width, this.bounds.height);
            };
            DynamicTexture.prototype.render = /**
            * Renders this DynamicTexture to the Stage at the given x/y coordinates
            *
            * @param x {number} The X coordinate to render on the stage to (given in screen coordinates, not world)
            * @param y {number} The Y coordinate to render on the stage to (given in screen coordinates, not world)
            */
            function (x, y) {
                if (typeof x === "undefined") { x = 0; }
                if (typeof y === "undefined") { y = 0; }
                if(this.globalCompositeOperation) {
                    this.game.stage.context.save();
                    this.game.stage.context.globalCompositeOperation = this.globalCompositeOperation;
                }
                this.game.stage.context.drawImage(this.canvas, x, y);
                if(this.globalCompositeOperation) {
                    this.game.stage.context.restore();
                }
            };
            Object.defineProperty(DynamicTexture.prototype, "width", {
                get: function () {
                    return this.bounds.width;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DynamicTexture.prototype, "height", {
                get: function () {
                    return this.bounds.height;
                },
                enumerable: true,
                configurable: true
            });
            return DynamicTexture;
        })();
        Display.DynamicTexture = DynamicTexture;        
    })(Phaser.Display || (Phaser.Display = {}));
    var Display = Phaser.Display;
})(Phaser || (Phaser = {}));
