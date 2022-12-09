# SGRAI_PROJECT

## Use Case:
<p align="center">
    <img src="https://user-images.githubusercontent.com/85360923/205863756-8f89c29a-7978-4280-ac82-5a867ce9692d.png" />
</p>

## Database (For Sprint A):
<p align="center">
    <b>In order to test functionality for 'sprint A' of SGRAI classes data that in the future will be loaded from MongoDB and SSMS databases was created by hardcoding, all the informations comes from project requirements.</b>
    <img src="https://user-images.githubusercontent.com/85360923/205871617-7250f031-b914-4de9-a290-e1aea2e2e13d.png" />
</p>

## Basic ThreeJS Settings:
<p align="center">
    <b>Custom usage of renderer.toneMapping and renderer.ouputEncoding, in order to make sure that it's possible to display render properly in current device.</b>
    <img src="https://user-images.githubusercontent.com/85360923/205873857-fb608e45-a39c-49db-8cc8-8baf44b4c521.png"/>
</p>

## Adding Absolute And Point Lighting To The Scene:
<p align="center">
    <b>Demand for both those lighting methodes comes from the fact that, without the absolute lighting the objects in the scene will just be too dark, and we need a point lighting to show the depth of the objects.</b>
    <img src="https://user-images.githubusercontent.com/85360923/205874769-838e8f18-b04c-41b8-816e-fb1ca5c35074.png"/>
</p>

## Setting The Camera Controls:
<p align="center">
    <b>Except setting basic settings those lines makes sure that camera will orbit around the middle of the scene that is (0,0,0) point. Also controls.dampingFactor and controls.enableDamping smoothen out the movement of camera. Task of commented line is to show usage of panning (in this case around the most busy warehouse no. 12).</b>
    <img src="https://user-images.githubusercontent.com/85360923/205875346-4d062db3-c59b-4cf0-9303-5877c35fde4a.png"/>
</p>

## Creating The Objects:
<p align="center">
    <b>In this sprint we use static number (17) to create right amount of the warehouses. Also the height is divide by two for the readability of visualization. The magic numbers such as 0.02, 0.01... are added to solve the blinking problem in obvious and easy way.</b>
    <img src="https://user-images.githubusercontent.com/85360923/205962749-628ca3ca-def4-4088-b606-5e3b2e04f7e9.png"/>
</p>

## Functions And Meshes Related To Basic Geometry Objects:
<p align="center">
    <img src="https://user-images.githubusercontent.com/85360923/205956570-40dfea57-2fa8-48b6-837f-a1125148de54.png"/>
</p>
<p align="center">
    <img src="https://user-images.githubusercontent.com/85360923/205957056-0990efb6-68e3-4891-b4c3-ed8142797a58.png"/>
</p>
<p align="center">
    <img src="https://user-images.githubusercontent.com/85360923/205957514-d9c1e6ac-4a77-406e-86c6-78b1fbae340b.png"/>
</p>

## Circle Mesh / Adding Texture To Circle Under Warehouse:
<p align="center">
    <b>Uploading texture from assets file. (Texture was created via gimp, so there's no license file). Color is additional in this case, it was added to fit better with palette of whole project.</b>
    <img src="https://user-images.githubusercontent.com/85360923/205959295-f9b6c1cc-9ad3-40f4-a31a-358abd6c68c1.png"/>
</p>

## Warehouses Models:
<p align="center">
    <b>Using GLTF loader to generate model. The model was took from www.sketchfab.com and license and all the credits about the author are in license.txt file.</b>
    <img src="https://user-images.githubusercontent.com/85360923/205963605-d7ea8c2d-33d5-40ae-88b4-cea87cbe2b26.png"/>
</p>

## Creating Paths:
<p align="center">
    <b>For the sake of this documentation creation of path can be seperated to lineGeometry and planeGeometry parts.</b>
    <img src="https://user-images.githubusercontent.com/85360923/205967389-86d7da61-5753-4113-8f2a-a9a695a74e4e.png"/>
</p>

## Little Issue:
<p align="center">
    <b>As this project is my first more complex project with 3D visualization I wasn't aware of the basic settings of the axis (I thought that rules for the axis are the same as in 2d visualization + depth). I used: x as width, y as height, z as depth. Like this:</b>
</p>

<p align="center">
    <img src="https://user-images.githubusercontent.com/85360923/206737932-aec2c5c1-98e8-4d80-a1f9-a442fa57fb8b.png"/>
</p>

<p align="center">
    <b>What I was supposed to do was set up axis like: y as width, z as height, x as depth. Changing this setting would make whole project a lot easier because I could use the solutions from Web (Next part of this documentation is largely about math which was used to set up the path in between warehouses, that's the reason I'm adding this important information right now). The issue should be solved by changing the axis and then values to proper before working on the Sprint B part.</b>
</p>

## Creating Help Line (Line Geometry):
<p align="center">
    <b>I started the work on paths by creating the "help line" which would be THREE.BufferGeometry().setFromPoints(). Firstly I needed two more points, I had to calculate where the "slope" of the path will start and where it will end. For this purpose I calculated the values: 'si' (which is be the length of the link elemenet) and 'alpha' (which is direction of the link element).</b>
    <img src="https://user-images.githubusercontent.com/85360923/206741188-e7e26c35-e70f-433e-a614-d20b47ead413.png"/>
</p>


<p align="center">
    <b>After creating those points I added them to "points" array, in this order: first warehouse, start slope, end slope, second warehouse. After that I added the material and the geometry to mesh and then added it to the scene.</b>
    <img src="https://user-images.githubusercontent.com/85360923/206745159-2107cc87-75a3-42ba-b4e7-3f4c0828d0c3.png"/>
</p>
