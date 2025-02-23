import com.palantir.gradle.docker.DockerExtension
import groovy.json.JsonOutput
import java.io.IOException
import java.util.function.Function
import java.util.regex.Pattern

import com.github.gradle.node.npm.proxy.ProxySettings
import com.github.gradle.node.npm.task.NpmTask
import com.github.gradle.node.npm.task.NpxTask
import com.github.gradle.node.task.NodeTask
import com.github.gradle.node.yarn.task.YarnTask

val dockerRepository: String by project
val ngDistDir = "${project.projectDir}/dist"
val ngOutputDir = "${ngDistDir}/static"
val ngConfDir = "${ngDistDir}/nginx"

plugins {
    idea
    java
    id("com.github.node-gradle.node") version "3.5.1"
    id("com.palantir.docker") version "0.35.0"
}

//node {
//  setVersion("10.24.0")
//
//  workDir = file("${project.buildDir}/node")
//
//  version = "10.24.0"
//  npmVersion = "6.11.3"
////  Plugin is not able to download node due incompatibility with gradle 6+
////  https://stackoverflow.com/questions/60604212/configuring-springboot-gadle-with-nodejs
//  download = false
//  workDir = file("${project.buildDir}/node")
//  nodeModulesDir = file("${project.projectDir}")
//}

node {
  version.set("18.20.6")
  npmVersion.set("")
  yarnVersion.set("")
  npmInstallCommand.set("install")
  distBaseUrl.set("https://nodejs.org/dist")
  download.set(false)
  workDir.set(file("${project.projectDir}/.cache/nodejs"))
  npmWorkDir.set(file("${project.projectDir}/.cache/npm"))
  yarnWorkDir.set(file("${project.projectDir}/.cache/yarn"))
  nodeProjectDir.set(file("${project.projectDir}"))
  nodeProxySettings.set(ProxySettings.SMART)
}

description = "I-Home UI"

repositories {
  mavenCentral()
  maven { setUrl("https://build.avs.comodoca.net/archiva/repository/internal/") }
  maven { setUrl("https://build.avs.comodoca.net/archiva/repository/snapshots/") }
  maven { setUrl("https://repo.spring.io/release/") }
  maven { setUrl("https://plugins.gradle.org/m2/") }
}

fun execCommandWithOutput(input: String): String {
    return try {
        val parts = input.split("\\s".toRegex())
        val proc = ProcessBuilder(*parts.toTypedArray())
                .directory(rootDir)
                .redirectOutput(ProcessBuilder.Redirect.PIPE)
                .redirectError(ProcessBuilder.Redirect.PIPE)
                .start()
        proc.waitFor(20, TimeUnit.SECONDS)
        proc.inputStream.bufferedReader().readText().trim()
    } catch(e: IOException) {
        "<empty>"
    }
}

// clean node/node_modules/dist
task("npmClean") {
    println("Removing directory: $ngDistDir")
    delete(ngDistDir)
}

tasks.getByName("clean").dependsOn("npmClean")

task("prepareNpm") {
    file(ngOutputDir).mkdirs()
}

task<NpmTask>("compileTypeScript") {
  args.set(listOf("run-script", "tsc"))
}

task<NpmTask>("npmStart") {
  group = "node"
  args.set(listOf("start"))
  dependsOn("npmInstall")
}

task<NpmTask>("npmBuild") {
    inputs.files(fileTree("node_modules"))
    inputs.files(fileTree("src"))
    inputs.file("package.json")
    outputs.dir(ngOutputDir)
    args.set(listOf("run", "prod"))
    group = "node"
    dependsOn("npmInstall")
}

tasks.getByName("npmSetup").dependsOn( "prepareNpm")

task("prepareFiles") {
    file("${project.buildDir}/docker/nginx").mkdir()
    doLast {
        println("Creating new docker image $version")
        copy {
            from(ngDistDir)
            into("${project.buildDir}/docker")
        }
        copy {
            println("Copying nginx.conf to $ngConfDir")
            from("${project.projectDir}/nginx.conf")
            into("${project.buildDir}/docker/nginx")
            fileMode = 0b110100100
        }
    }
}

tasks.getByName("docker").dependsOn("prepareFiles")

tasks.getByName("prepareFiles").dependsOn("npmBuild")

configure<DockerExtension> {
    name = "$dockerRepository/ihome/ui"
    tags("$version", "latest")
    setDockerfile(file("Dockerfile"))
}

tasks.named("dockerPush") {
    dependsOn ("dockerTag")
}

idea {
    project {
        module {
            name = rootProject.name
            setDownloadJavadoc(true)
        }
    }
}
