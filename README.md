# SGRAI_PROJECT

## USE CASE:
<p align="center">
    <img src="https://user-images.githubusercontent.com/85360923/205863756-8f89c29a-7978-4280-ac82-5a867ce9692d.png" />
</p>

## DATABASE (FOR SPRINT A):
<p align="center">
    <b>In order to test functionality for 'sprint A' of SGRAI classes data that in the future will be loaded from MongoDB and SSMS databases was created by hardcoding, all the informations comes from project requirements.</b>
    <img src="https://user-images.githubusercontent.com/85360923/205871617-7250f031-b914-4de9-a290-e1aea2e2e13d.png" />
</p>

## BASIC THREEJS SETTINGS:
<p align="center">
    <b>Custom usage of renderer.toneMapping and renderer.ouputEncoding, in order to make sure that it's possible to display render properly in current device.</b>
    <img src="https://user-images.githubusercontent.com/85360923/205873857-fb608e45-a39c-49db-8cc8-8baf44b4c521.png"/>
</p>

## ADDING ABSOLUTE AND POINT LIGHTING TO THE SCENE:
<p align="center">
    <b>Demand for both those lighting methodes comes from the fact that, without the absolute lighting the objects in the scene will just be too dark, and we need a point lighting to show the depth of the objects.</b>
    <img src="https://user-images.githubusercontent.com/85360923/205874769-838e8f18-b04c-41b8-816e-fb1ca5c35074.png"/>
</p>

## SETTING THE CAMERA CONTROLS:
<p align="center">
    <b>Except setting basic settings those lines makes sure that camera will orbit around the middle of the scene that is (0,0,0) point. Also controls.dampingFactor and controls.enableDamping smoothen out the movement of camera. Task of commented line is to show usage of panning (in this case around the most busy warehouse no. 12).</b>
    <img src="https://user-images.githubusercontent.com/85360923/205875346-4d062db3-c59b-4cf0-9303-5877c35fde4a.png"/>
</p>

## CREATING THE OBJECTS:
<p align="center">
    <b>In this sprint we use static number (17) to create right amount of the warehouses. Also the height is divide by two for the readability of visualization. The magic numbers such as 0.02, 0.01... are added to solve the blinking problem in obvious and easy way.</b>
    <img src="https://user-images.githubusercontent.com/85360923/205962749-628ca3ca-def4-4088-b606-5e3b2e04f7e9.png"/>
</p>

## FUNCTIONS AND MESHES RELATED TO BASIC GEOMETRY OBJECTS:
<p align="center">
    <img src="https://user-images.githubusercontent.com/85360923/205956570-40dfea57-2fa8-48b6-837f-a1125148de54.png"/>
</p>
<p align="center">
    <img src="https://user-images.githubusercontent.com/85360923/205957056-0990efb6-68e3-4891-b4c3-ed8142797a58.png"/>
</p>
<p align="center">
    <img src="https://user-images.githubusercontent.com/85360923/205957514-d9c1e6ac-4a77-406e-86c6-78b1fbae340b.png"/>
</p>

## CIRCLE MESH / ADDING TEXTURE TO CIRCLE UNDER WAREHOUSE:
<p align="center">
    <b>Uploading texture from assets file. (Texture was created via gimp, so there's no license file). Color is additional in this case, it was added to fit better with palette of whole project.</b>
    <img src="https://user-images.githubusercontent.com/85360923/205959295-f9b6c1cc-9ad3-40f4-a31a-358abd6c68c1.png"/>
</p>

## WAREHOUSES MODELS:
<p align="center">
    <b>Using GLTF loader to generate model. The model was took from www.sketchfab.com and license and all the credits about the author are in license.txt file.</b>
    <img src="https://user-images.githubusercontent.com/85360923/205963605-d7ea8c2d-33d5-40ae-88b4-cea87cbe2b26.png"/>
</p>

## CREATING PATHS:
<p align="center">
    <b>For the sake of this documentation creation of path can be seperated to lineGeometry and planeGeometry parts.</b>
    <img src="https://user-images.githubusercontent.com/85360923/205967389-86d7da61-5753-4113-8f2a-a9a695a74e4e.png"/>
</p>



