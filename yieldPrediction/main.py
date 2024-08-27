import pickle
from flask import Flask, render_template, request
import pandas as pd
import subProcess

app=Flask(__name__)
model=pickle.load(open("Yield_Prediction","rb"))
data=pd.read_csv('Crop_Yield_Prediction.csv')

@app.route("/")
def index():
    crops = sorted(data['Crop'].unique())
    return render_template("yield2.html", crops=crops)

@app.route("/predict", methods=['GET','POST'])
def predict():
    croops = ['Apple', 'Banana','Rice','Pomegranate','PigeonPeas','Papaya','Orange', 'Muskmelon', 'MungBean','MothBeans','Mango','Maize','Lentil','KidneyBeans','Jute','Grapes','Cotton','Coffee','Coconut','ChickPea','Blackgram','Watermelon']
    nitrogen = int(request.form.get('nitrogen'))
    phosphorous = int(request.form.get('phosphorous'))
    potassium = int(request.form.get('potassium'))
    temp = float(request.form.get('temp'))
    phv = float(request.form.get('phv'))
    humid = float(request.form.get('phv'))
    rain = float(request.form.get('rain'))
    CROP = request.form.get('CROP')
    crops = sorted(data['Crop'].unique())

    prediction=model.predict([[nitrogen,phosphorous,potassium,temp,phv,humid,rain,croops.index(CROP) + 1]])
    output=round(prediction[0],2)
    return render_template("yield2.html", prediction_text=f'Yield is {output}', crops=crops)

if __name__=="__main__":
    app.run(debug=True)