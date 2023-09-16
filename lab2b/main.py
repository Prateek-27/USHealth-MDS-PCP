from flask import Flask, render_template, request, redirect, url_for, jsonify
import pandas as pd
import numpy as np
import sklearn
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from sklearn import metrics
from sklearn.manifold import MDS
import warnings
warnings.filterwarnings("ignore")


app = Flask(__name__)

@app.route('/mds_data')
def mds_data():
    # Import csv
    data = pd.read_csv('templates/final.csv')

    # Only keep numerical columns
    cat_attri = ['state', 'county', 'percent_excessive_drinking_cat', 'population_density_per_sqmi_cat']
    X = data[data.columns.difference(cat_attri)]
    
    # MDS (Euclidean distance)
    mds_euc = MDS(n_components=2, dissimilarity='euclidean')
    X_std = StandardScaler().fit_transform(X)
    X_transformed = mds_euc.fit_transform(X_std)

    x = X_transformed[:, 0]
    y = X_transformed[:, 1]

    x = x.tolist()
    y = y.tolist()

    X_new = np.array(X_transformed)

    # Standardize the features
    scaler = StandardScaler()
    X_new = scaler.fit_transform(X_new)

    # perform k-means clustering
    kmeans = KMeans(n_clusters=2)
    labels = kmeans.fit_predict(X_new)
    labels = labels.tolist()


    return jsonify(x=x, y=y, labels=labels)

@app.route('/mds_variable')
def mds_variable():
    # Import csv
    data = pd.read_csv('templates/final.csv')

    # Only keep numerical columns
    cat_attri = ['state', 'county', 'percent_excessive_drinking_cat', 'population_density_per_sqmi_cat']
    X = data[data.columns.difference(cat_attri)]
    
    # MDS (1 - |Correlation| distance)
    # Correlation MDS
    mds_corr = MDS(n_components=2, dissimilarity='precomputed')
    X = data[data.columns.difference(cat_attri)]
    X_std = StandardScaler().fit_transform(X)
    mds_data = pd.DataFrame(X_std)

    corr_matrix = mds_data.corr()


    corr_dist_matrix = pd.DataFrame()

    for column in corr_matrix.columns:
        corr_dist_matrix[column] = 1 - abs(corr_matrix[column].values[:])

    corr_dist_matrix_transformed = mds_corr.fit_transform(corr_dist_matrix)

    x = corr_dist_matrix_transformed[:, 0].tolist()
    y = corr_dist_matrix_transformed[:, 1].tolist()
    cols = X.columns.tolist()

    return jsonify(x=x, y=y, cols=cols)

@app.route('/pcp_data')
def pcp_data():
    # Import csv
    data = pd.read_csv('templates/final.csv')
    cols = data.columns.tolist()

    col_data = {}
    for col in cols:
        col_data[col] = data[col].tolist()

    cat_attri = ['state', 'county', 'percent_excessive_drinking_cat', 'population_density_per_sqmi_cat']
    new_data = data[data.columns.difference(cat_attri)]

    data_X = np.array(new_data)

    # Standardize the features
    scaler = StandardScaler()
    data_X = scaler.fit_transform(data_X)

    # perform k-means clustering
    kmeans = KMeans(n_clusters=2)
    labels = kmeans.fit_predict(data_X)

    data['Labels'] = labels
    return data.to_csv(index=False)


@app.route("/")
def index():
    return render_template("index.html")

@app.route("/mds")
def mds():
    return render_template("mds.html")

@app.route("/pcp")
def pcp():
    return render_template("pcp.html")

@app.route("/pcp_mds")
def pcp_mds():
    return render_template("pcp_mds.html")

if __name__ == "__main__":
    app.run(debug=True)

def main():
    pass


