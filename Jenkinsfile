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
            distCmd = 'dist'
        }
    }

    stage('Publish to skunkhenry') {
        withPrivateNPMRegistry {
            try { 
                sh "npm publish dist/fh-fhc-*${BUILD_NUMBER}.tar.gz"
            } catch (Exception e) {
                if (readFile('npm-debug.log').contains("EPUBLISHCONFLICT")) {
                    echo 'This build has already been published to npm'
                }
            }
        }
    }
}
