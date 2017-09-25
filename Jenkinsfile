#!groovy

// https://github.com/feedhenry/fh-pipeline-library
@Library('fh-pipeline-library') _

fhBuildNode {
    stage('Install Dependencies') {
        npmInstall {}
    }

    stage('Test') {
        sh 'grunt test'
    }


    stage('Build') {
        gruntBuild {
            name = 'fh-fhc'
        }
    }
}
