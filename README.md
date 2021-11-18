# image-classifier
This image predictor is a Voila web application, deployed on Heroku. The model was created with fastai framework over PyTorch.  

## Table of Contents
* [Goals](#goals)
* [Development Process](#development-process)
* [Usage](#usage)

## Goals
Create a machine learning model that can accurately predict among various engdangered wild felines.  

<img width="1538" alt="Inspiration" src="https://user-images.githubusercontent.com/80362935/142331955-a46e613e-c846-44a0-8515-46ac8155e815.png">

## Development Process
In order to successfully complete this project, the team's workflow was executed as follows:
1. Define purpose and map out the neccesarry steps to put into action.
2. Search for usable datasets to implement into model.
3. Clean data and extract the url for each usable image.
4. Download images accordingly into classes defined by scientific name. 
5. Train model utilizing fastai's deep learning library.  
6. Fine tune model and make adjustments for oversampling, etc. 
7. Create Voila application using exported model. 
8. Deploy model with Heroku. 
<img width="1538" alt="Project Development" src="https://user-images.githubusercontent.com/80362935/142331976-d007fbc2-67ab-47c5-9c84-6c728125555a.png">


## Usage
This application can be accessed [here](https://felines-test.herokuapp.com/).  

To use this image classifier and predict your own images, try using species with these scientific names:  

Acinonyx jubatus, Caracal caracal, Felis chaus, Felis silvestris, Herpailurus yagouaroundi, 
Leopardus geoffroyi, Leopardus pardalis, Leopardus wiedii, Leptailurus serval, Lynx canadensis, 
Lynx lynx, Lynx rufus, Panthera leo, Panthera onca, Panthera pardus_kotiya, Panthera pardus,
Panthera tigris tigris, Panthera uncia, Prionailurus bengalensis, or Puma concolor.  

<img width="679" alt="predict_example" src="https://user-images.githubusercontent.com/80362935/142337048-cbd57409-3a53-4dc5-9d5e-092ee1db844e.png">

Team Members: Johnny, Karen, Fernando, Norman, Nico
