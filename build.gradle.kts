import com.moowork.gradle.node.npm.NpmTask
import com.palantir.gradle.docker.DockerExtension
import groovy.json.JsonOutput
import java.io.IOException
import java.util.function.Function
import java.util.regex.Pattern

val dockerRepository: String by project

node {
    version = "10.23.1"
    npmVersion = "6.11.3"
    download = true
    workDir = file("${project.buildDir}/node")
    nodeModulesDir = file("${project.projectDir}")
}

plugins {
    idea
    java
    id("com.moowork.node") version "1.3.1"
    id("org.sonarqube") version "2.6.2"
    id("com.palantir.docker") version "0.20.1"
    id("net.ltgt.apt") version "0.10"
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

val ngDistDir = "${project.projectDir}/dist"
val ngOutputDir = "${ngDistDir}/static"
val ngConfDir = "${ngDistDir}/nginx"

// clean node/node_modules/dist
task("npmClean") {
    println("Removing directory: $ngDistDir")
    delete(ngDistDir)
}

tasks.named("clean") {
  dependsOn("npmClean")
}

task("prepareNpm") {
    file(ngOutputDir).mkdirs()
}

task<NpmTask>("compileTypeScript") {
    setArgs(listOf("run-script", "tsc"))
}

task<NpmTask>("npmStart") {
  group = "node"
  setArgs(listOf("start"))
  dependsOn("npmInstall")
}

task<NpmTask>("npmBuild") {
    inputs.files(fileTree("node_modules"))
    inputs.files(fileTree("src"))
    inputs.file("package.json")
    outputs.dir(ngOutputDir)
    setArgs(listOf("run", "prod"))
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

sonarqube {
    properties {
        property("sonar.sources", "src")
        property("sonar.typescript.node", node.variant.nodeExec)
    }
}

tasks.getByName("docker").dependsOn("prepareFiles")

tasks.getByName("prepareFiles").dependsOn("npmBuild")

configure<DockerExtension> {
    name = "$dockerRepository/iot/ui"
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
